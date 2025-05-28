import { z } from 'zod';

export const LOCATION_TYPES_LIST = ['Point'];

export const LatitudeSchema = z.number({ coerce: true }).min(-90).max(90);
export const LongitudeSchema = z.number({ coerce: true }).min(-180).max(180);

export const LocationSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([LongitudeSchema, LatitudeSchema]),
});

export type Location = z.infer<typeof LocationSchema>;
