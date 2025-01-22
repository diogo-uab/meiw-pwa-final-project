import { z } from 'zod';

export const RefreshTokenRequestDtoSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
export type RefreshTokenRequestDtoType = z.infer<typeof RefreshTokenRequestDtoSchema>;
