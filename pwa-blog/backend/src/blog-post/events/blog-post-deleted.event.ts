import { BlogPostDocument } from '../schemas/blog-post.schema';

export class BlogPostDeletedEvent {
  public static EVENT = 'blog-post.deleted';

  constructor(
    public readonly blogPostId: string,
    public readonly blogPost: BlogPostDocument,
  ) {}
}
