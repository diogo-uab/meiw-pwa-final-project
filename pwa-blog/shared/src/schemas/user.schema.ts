import { z } from 'zod';
import { RoleSchema } from '../roles';
import { IdSchema, TimestampSchema } from './utils';

export const UserSchema = z.object({
  _id: IdSchema,
  role: RoleSchema,
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema.optional(),
});

export type UserType = z.infer<typeof UserSchema>;
