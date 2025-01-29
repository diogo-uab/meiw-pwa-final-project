import { z } from 'zod';
import { NewPasswordSchema } from '../auth/register.dto';

export const UpdateUserPasswordDtoSchema = z.object({
  newPassword: NewPasswordSchema,
  currentPassword: z.string().min(1, 'Current password is required'),
});
export type UpdateUserPasswordDtoType = z.infer<typeof UpdateUserPasswordDtoSchema>;
