import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';

export const NewPasswordSchema = z.string().min(6, 'Password should have at least 6 characters');

export const RegisterRequestDtoSchema = UserSchema.pick({
  name: true,
  email: true,
}).extend({
  password: NewPasswordSchema,
});

export type RegisterRequestDtoType = z.infer<typeof RegisterRequestDtoSchema>;
