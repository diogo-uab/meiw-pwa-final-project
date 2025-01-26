import { z } from 'zod';
import { CreateUserDtoSchema } from './create-user.dto';

export const UpdateUserDtoSchema = CreateUserDtoSchema.omit({ password: true });

export type UpdateUserDtoType = z.infer<typeof UpdateUserDtoSchema>;
