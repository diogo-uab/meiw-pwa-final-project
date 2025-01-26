import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';
import { NewPasswordSchema } from '../auth/register.dto';

export const CreateUserDtoSchema = UserSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: NewPasswordSchema,
});

export type CreateUserDtoType = z.infer<typeof CreateUserDtoSchema>;
