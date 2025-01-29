import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Model } from 'mongoose';
import { CreateBlogPostDtoType } from '@pwa/shared';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { UserDeletedEvent } from '../user/events/user-deleted.event';
import { BlogPostDeletedEvent } from './events/blog-post-deleted.event';

@Injectable()
export class BlogPostService {
  private readonly logger = new Logger(BlogPostService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPost>,
  ) {}

  getAll(search?: string): Promise<BlogPostDocument[]> {
    const searchExpression = search ? new RegExp(search, 'i') : null;
    return this.blogPostModel
      .find(
        searchExpression
          ? {
              $or: [
                { body: searchExpression },
                { title: searchExpression },
                { description: searchExpression },
              ],
            }
          : {},
      )
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
    const post = await this.blogPostModel.create(createPostDto);
    await post.populate('author');
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
