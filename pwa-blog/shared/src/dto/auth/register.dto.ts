import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';

export const RegisterRequestDtoSchema = UserSchema.pick({
  name: true,
  email: true,
}).extend({
  password: z.string().min(6, 'Password should have at least 6 characters'),
});

export type RegisterRequestDtoType = z.infer<typeof RegisterRequestDtoSchema>;
