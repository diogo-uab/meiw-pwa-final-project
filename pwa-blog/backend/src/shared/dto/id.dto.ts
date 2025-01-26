import { IdSchema } from '@pwa/shared';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const IdDtoSchema = z.object({
  id: IdSchema,
});

export class IdDto extends createZodDto(IdDtoSchema) {}
