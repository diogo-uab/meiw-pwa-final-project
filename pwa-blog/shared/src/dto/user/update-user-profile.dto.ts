import { z } from 'zod';
import { UserSchema } from '../../schemas/user.schema';

export const UpdateUserProfileDtoSchema = UserSchema.pick({
  name: true,
  email: true,
});

export type UpdateUserProfileDtoType = z.infer<typeof UpdateUserProfileDtoSchema>;
