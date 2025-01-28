import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role, ROLES_LIST } from '@pwa/shared';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    enum: ROLES_LIST,
    default: Role.User,
    required: true,
  })
  role: Role;

  createdAt: Date;
  udpatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
