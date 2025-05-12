import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LocationQuerySchema = z.object({
  latitude: z.number({ coerce: true }),
  longitude: z.number({ coerce: true }),
  distance: z.number({ coerce: true }),
});

export class LocationQueryDto extends createZodDto(LocationQuerySchema) {}
