import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { LatitudeSchema, LongitudeSchema } from '@pwa/shared';

export const LocationQuerySchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
  distance: z.number({ coerce: true }).nonnegative(),
});

export class LocationQueryDto extends createZodDto(LocationQuerySchema) {}
