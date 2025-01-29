import { UpdateUserPasswordDtoSchema } from '@pwa/shared';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserPasswordDto extends createZodDto(
  UpdateUserPasswordDtoSchema,
) {}
