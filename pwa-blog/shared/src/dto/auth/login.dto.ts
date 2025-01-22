import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';

export const LoginRequestDtoSchema = UserSchema
  .pick({ email: true })
  .extend({ password: z.string().min(1, 'Password is required') });
export type LoginRequestDtoType = z.infer<typeof LoginRequestDtoSchema>;
