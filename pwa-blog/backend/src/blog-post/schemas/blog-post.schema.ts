import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {
  ObjectId,
  Document,
  PopulatedDoc,
  HydratedDocument,
} from 'mongoose';
import { Location, LOCATION_TYPES_LIST } from '@pwa/shared';
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

  @Prop(
    raw({
      type: { type: String, enum: LOCATION_TYPES_LIST },
      coordinates: { type: [Number] },
    }),
  )
  location?: Location | null;

  createdAt: Date;
  udpatedAt: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
BlogPostSchema.index({ location: '2dsphere' });
