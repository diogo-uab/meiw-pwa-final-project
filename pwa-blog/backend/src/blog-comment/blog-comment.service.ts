import {
  Logger,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  BlogComment,
  BlogCommentDocument,
} from './schemas/blog-comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { includesRole, Role } from '@pwa/shared';
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from './dto/create-update-blog-comment.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { BlogPostService } from '../blog-post/blog-post.service';
import { UserDeletedEvent } from '../user/events/user-deleted.event';
import { BlogPostDeletedEvent } from '../blog-post/events/blog-post-deleted.event';

@Injectable()
export class BlogCommentService {
  private readonly logger = new Logger(BlogCommentService.name);

  constructor(
    private blogPostService: BlogPostService,
    @InjectModel(BlogComment.name) private blogCommentModel: Model<BlogComment>,
  ) {}

  async getById(
    id: string,
    populate: boolean = true,
  ): Promise<BlogCommentDocument> {
    const comment = await this.blogCommentModel.findById(id);
    if (!comment) throw new NotFoundException('Comment not found for given ID');
    if (populate) await comment.populate(['post', 'author']);
    return comment;
  }

  async getAllByPostId(postId: string): Promise<BlogCommentDocument[]> {
    return this.blogCommentModel.find({ post: postId }).populate('author');
  }

  async getAllByUserId(userId: string): Promise<BlogCommentDocument[]> {
    return this.blogCommentModel
      .find({ author: userId })
      .sort({ createdAt: 'desc' })
      .populate(['post', 'author']);
  }

  async create(
    currentUser: UserDocument,
    createBlogCommentDto: CreateBlogCommentDto,
  ) {
    // Validates that the post to be associated with the comment exists (throws NotFoundException)
    await this.blogPostService.getById(
      typeof createBlogCommentDto.post === 'object'
        ? createBlogCommentDto.post._id
        : createBlogCommentDto.post,
    );

    const comment = await this.blogCommentModel.create({
      ...createBlogCommentDto,
      author: currentUser,
    });
    await comment.populate('author');
    return comment;
  }

  async update(
    id: string,
    user: UserDocument,
    updateBlogCommentDto: UpdateBlogCommentDto,
  ): Promise<BlogCommentDocument> {
    const comment = await this.getById(id);
    this.assertUserCanManageComment(user, comment);
    comment.set(updateBlogCommentDto);
    await comment.save();
    await comment.populate('author');
    return comment;
  }

  async delete(id: string, user: UserDocument): Promise<void> {
    const comment = await this.getById(id, false);
    this.assertUserCanManageComment(user, comment);
    await comment.deleteOne();
  }

  @OnEvent(UserDeletedEvent.EVENT)
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    this.logger.verbose('Handling UserDeletedEvent');
    try {
      const result = await this.blogCommentModel.deleteMany({
        author: event.userId,
      });
      this.logger.log(
        `Handle UserDeletedEvent: Deleted ${result.deletedCount} comments`,
      );
    } catch (e) {
      this.logger.error(
        'Handle UserDeletedEvent: Failed to delete comments',
        e?.stack,
      );
    }
  }

  @OnEvent(BlogPostDeletedEvent.EVENT)
  async handleBlogPostDeletedEvent(event: BlogPostDeletedEvent) {
    this.logger.verbose('Handling BlogPostDeletedEvent');
    try {
      const result = await this.blogCommentModel.deleteMany({
        post: event.blogPostId,
      });
      this.logger.log(
        `Handle BlogPostDeletedEvent: Deleted ${result.deletedCount} comments`,
      );
    } catch (e) {
      this.logger.error(
        'Handle BlogPostDeletedEvent: Failed to delete comments',
        e?.stack,
      );
    }
  }

  /**
   * Verifies if the provided `user` can manage (update, delete) the `comment`.
   *
   * * Admins can manage every comment.
   * * Regular users can manage comments they created.
   *
   * @throws {ForbiddenException}
   */
  private assertUserCanManageComment(
    user: UserDocument,
    comment: BlogCommentDocument,
  ): void {
    // Admins can manage any comment
    if (includesRole(user.role, Role.Admin)) return;

    // Users can manage their own comments
    if (
      comment.author &&
      user._id.toString() === comment.author._id.toString()
    ) {
      return;
    }

    this.logger.debug(
      'Forbidden, user attempted to manage comment from another user',
    );
    throw new ForbiddenException(
      "You don't have permission to manage this comment",
    );
  }
}
