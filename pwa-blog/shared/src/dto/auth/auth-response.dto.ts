import { z } from 'zod';
import { UserDtoSchema } from '../user/user.dto';
import { TimestampSchema } from '../../schemas/utils';

export const AuthResponseDtoSchema = z.object({
  user: UserDtoSchema,
  accessToken: z.string(),
  accessTokenExpiresAt: TimestampSchema,
  refreshToken: z.string(),
  refreshTokenExpiresAt: TimestampSchema,
});

export type AuthResponseDtoType = z.infer<typeof AuthResponseDtoSchema>;
