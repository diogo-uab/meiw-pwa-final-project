import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  ObjectId,
  Document,
  PopulatedDoc,
  HydratedDocument,
} from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ type: String, required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: PopulatedDoc<Document<ObjectId> & User>[];

  createdAt: Date;
  udpatedAt: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
