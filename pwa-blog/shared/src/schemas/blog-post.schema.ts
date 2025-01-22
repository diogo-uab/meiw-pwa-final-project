import { z } from 'zod';
import { UserSchema } from './user.schema';
import { IdSchema, ReferenceSchema, TimestampSchema } from './utils';

export const BlogPostSchema = z.object({
  _id: IdSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  body: z.string().min(1, 'Body is required'),
  author: ReferenceSchema(UserSchema),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema.optional(),
});

export type BlogPostType = z.infer<typeof BlogPostSchema>;
