import { z } from 'zod';

export const LOCATION_TYPES_LIST = ['Point'];

export const LocationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([z.number(), z.number()]),
});

export type Location = z.infer<typeof LocationSchema>;
