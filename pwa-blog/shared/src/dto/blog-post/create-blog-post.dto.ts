import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';
import { BlogPostSchema } from '../../schemas/blog-post.schema';
import { ReferenceSchema } from '../../schemas/utils';

export const CreateBlogPostDtoSchema = BlogPostSchema.omit({
  _id: true,
  author: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  author: ReferenceSchema(
    UserSchema
      .omit({ _id: true })
      .partial()
      .merge(UserSchema.pick({ _id: true })),
  ),
});
export type CreateBlogPostDtoType = z.infer<typeof CreateBlogPostDtoSchema>;
