import { z } from 'zod';
import { UserSchema } from './user.schema';
import { LocationSchema } from './location.schema';
import { IdSchema, ReferenceSchema, TimestampSchema } from './utils';

export const BlogPostSchema = z.object({
  _id: IdSchema,
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  body: z.string().min(1, 'Body is required'),
  author: ReferenceSchema(UserSchema),
  location: z.preprocess((data) => {
    if (
      data && typeof data === 'object' &&
      'toObject' in data && typeof data.toObject === 'function'
    ) {
      const obj = data.toObject();
      return (!obj || Object.keys(obj).length === 0) ? null : obj;
    }
    return data;
  }, LocationSchema.nullish().default(null)),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema.optional(),
  publishDate: TimestampSchema.nullish().default(null),
});

export type BlogPostType = z.infer<typeof BlogPostSchema>;
