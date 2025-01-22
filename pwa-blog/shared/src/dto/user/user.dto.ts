import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';

export const UserDtoSchema = UserSchema;
export type UserDtoType = z.infer<typeof UserDtoSchema>;

export const SimpleUserDtoSchema = UserDtoSchema.pick({
  _id: true,
  name: true,
});
export type SimpleUserDtoType = z.infer<typeof SimpleUserDtoSchema>;
