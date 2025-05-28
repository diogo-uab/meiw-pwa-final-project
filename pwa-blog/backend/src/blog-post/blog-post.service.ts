import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CreateBlogPostDtoType } from '@pwa/shared';
import { UserService } from '../user/user.service';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { LocationQueryDto } from './dto/location.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { UserDeletedEvent } from '../user/events/user-deleted.event';
import { BlogPostDeletedEvent } from './events/blog-post-deleted.event';

@Injectable()
export class BlogPostService {
  private readonly logger = new Logger(BlogPostService.name);

  constructor(
    private userService: UserService,
    private eventEmitter: EventEmitter2,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
  ) {}

  getAll(
    search?: string,
    locationSearch?: LocationQueryDto,
  ): Promise<BlogPostDocument[]> {
    const searchExpression = search ? new RegExp(search, 'i') : null;
    const searchQuery = searchExpression
      ? {
          $or: [
            { body: searchExpression },
            { title: searchExpression },
            { description: searchExpression },
          ],
        }
      : {};

    const locationQuery = locationSearch
      ? {
          location: {
            $near: {
              $maxDistance: locationSearch.distance * 1000, // km to meters
              $geometry: {
                type: 'Point',
                coordinates: [
                  locationSearch.longitude,
                  locationSearch.latitude,
                ],
              },
            },
          },
        }
      : {};

    return this.blogPostModel
      .find({
        $and: [
          searchQuery,
          locationQuery,
          {
            $or: [
              { publishDate: null },
              { publishDate: { $exists: false } },
              { publishDate: { $lte: new Date() } },
            ],
          },
        ],
      })
      .sort({ createdAt: 'desc' })
      .populate('author');
  }

  async getById(id: string): Promise<BlogPostDocument> {
    const blogPost = await this.blogPostModel.findById(id).populate('author');
    if (!blogPost)
      throw new NotFoundException('Blog post for given ID not found');
    return blogPost;
  }

  async create(
    createPostDto: CreateBlogPostDtoType,
  ): Promise<BlogPostDocument> {
    // Validates `author` user exists, throws `NotFoundException` if it doesn't.
    await this.userService.getById(
      typeof createPostDto.author === 'string'
        ? createPostDto.author
        : createPostDto.author._id,
    );

    const post = await this.blogPostModel.create(createPostDto);
    await post.populate('author');
    this.logger.log(`Created BlogPost(id: ${post.id}, title: "${post.title}")`);
    return post;
  }

  async update(
    id: string,
    updatePostDto: UpdateBlogPostDto,
  ): Promise<BlogPostDocument> {
    const post = await this.getById(id);
    post.set(updatePostDto);
    return post.save();
  }

  async delete(id: string): Promise<void> {
    const post: BlogPostDocument | null =
      await this.blogPostModel.findByIdAndDelete(id);
    if (!post) throw new NotFoundException('Blog post for given ID not found');

    this.logger.verbose(`Emitting BlogPostDeleted event for post: ${id}`);
    this.eventEmitter.emit(
      BlogPostDeletedEvent.EVENT,
      new BlogPostDeletedEvent(id, post),
    );
  }

  @OnEvent(UserDeletedEvent.EVENT)
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    this.logger.verbose('Handling UserDeletedEvent');
    try {
      const userPosts = await this.blogPostModel.find({ author: event.userId });
      if (!userPosts.length) {
        this.logger.verbose(`User has no posts to delete`);
        return;
      }

      await Promise.allSettled(
        userPosts.map(async (post) => {
          await post.deleteOne();
          this.logger.verbose(
            `Emitting BlogPostDeleted event for post: ${post._id}`,
          );
          this.eventEmitter.emit(
            BlogPostDeletedEvent.EVENT,
            new BlogPostDeletedEvent(post._id.toString(), post),
          );
        }),
      );
    } catch (e) {
      this.logger.error(
        'Handle UserDeletedEvent: Failed to delete posts',
        e?.stack,
      );
    }
  }
}
