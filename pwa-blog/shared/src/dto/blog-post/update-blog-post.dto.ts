import { z } from 'zod';
import { BlogPostSchema } from '../../schemas/blog-post.schema';

export const UpdateBlogPostDtoSchema = BlogPostSchema.omit({
  _id: true,
  author: true,
  createdAt: true,
  updatedAt: true,
});
export type UpdateBlogPostDtoType = z.infer<typeof UpdateBlogPostDtoSchema>;
