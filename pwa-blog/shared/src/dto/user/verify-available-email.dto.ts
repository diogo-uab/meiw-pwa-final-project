import { z } from 'zod';

export const VerifyAvailableEmailRequestDtoSchema = z.object({
  email: z.string().email(),
});
export type VerifyAvailableEmailRequestDtoType = z.infer<typeof VerifyAvailableEmailRequestDtoSchema>;

export const VerifyAvailableEmailResponseDtoSchema = z.object({
  isAvailable: z.boolean(),
});
export type VerifyAvailableEmailResponseDtoType = z.infer<typeof VerifyAvailableEmailResponseDtoSchema>;
