import { z } from 'zod';
import { BlogPostSchema } from '../../schemas/blog-post.schema';
import { SimpleUserDtoSchema } from '../user/user.dto';
import { ReferenceSchema } from '../../schemas/utils';

export const BlogPostResponseDtoSchema = BlogPostSchema
.omit({ author: true })
.extend({
  author: ReferenceSchema(SimpleUserDtoSchema),
});
export type BlogPostResponseDtoType = z.infer<typeof BlogPostResponseDtoSchema>;
