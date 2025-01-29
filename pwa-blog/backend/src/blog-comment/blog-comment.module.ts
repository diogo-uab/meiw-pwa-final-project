import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';
import { BlogComment, BlogCommentSchema } from './schemas/blog-comment.schema';
import { BlogPostModule } from '../blog-post/blog-post.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogComment.name, schema: BlogCommentSchema },
    ]),
    BlogPostModule,
  ],
  controllers: [BlogCommentController],
  providers: [BlogCommentService],
})
export class BlogCommentModule {}
