import { z } from 'zod';
import { UserSchema } from './user.schema';
import { BlogPostSchema } from './blog-post.schema';
import { IdSchema, ReferenceSchema, TimestampSchema } from './utils';

export const BlogCommentSchema = z.object({
  _id: IdSchema,
  content: z.string().min(1, 'Comment content is required'),
  post: ReferenceSchema(BlogPostSchema),
  author: ReferenceSchema(UserSchema),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema.optional(),
});

export type BlogCommentType = z.infer<typeof BlogCommentSchema>;
