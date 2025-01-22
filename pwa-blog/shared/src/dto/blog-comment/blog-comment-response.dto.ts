import { z } from 'zod';
import { BlogCommentSchema } from '../../schemas/blog-comment.schema';
import { SimpleUserDtoSchema } from '../user/user.dto';
import { ReferenceSchema } from '../../schemas/utils';
import { BlogPostResponseDtoSchema } from '../blog-post/blog-post-response.dto';

export const BlogCommentResponseDtoSchema = BlogCommentSchema
.omit({ post: true, author: true })
.extend({
  post: ReferenceSchema(BlogPostResponseDtoSchema),
  author: SimpleUserDtoSchema,
});
export type BlogCommentResponseDtoType = z.infer<typeof BlogCommentResponseDtoSchema>;
