import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  ObjectId,
  Document,
  PopulatedDoc,
  HydratedDocument,
} from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { BlogPost } from '../../blog-post/schemas/blog-post.schema';

export type BlogCommentDocument = HydratedDocument<BlogComment>;

@Schema({ timestamps: true })
export class BlogComment {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true,
  })
  post: PopulatedDoc<Document<ObjectId> & BlogPost>;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: PopulatedDoc<Document<ObjectId> & User>;

  createdAt: Date;
  udpatedAt?: Date;
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
