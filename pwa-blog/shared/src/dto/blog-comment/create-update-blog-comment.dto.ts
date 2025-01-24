import { z } from 'zod';
import { BlogCommentSchema } from '../../schemas/blog-comment.schema';

export const CreateBlogCommentDtoSchema = BlogCommentSchema.omit({
  _id: true,
  author: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateBlogCommentDtoType = z.infer<typeof CreateBlogCommentDtoSchema>;

export const UpdateBlogCommentDtoSchema = CreateBlogCommentDtoSchema;
export type UpdateBlogCommentDtoType = z.infer<typeof UpdateBlogCommentDtoSchema>;
