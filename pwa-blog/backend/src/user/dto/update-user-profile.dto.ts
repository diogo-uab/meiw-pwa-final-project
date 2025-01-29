import { UpdateUserProfileDtoSchema } from '@pwa/shared';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserProfileDto extends createZodDto(
  UpdateUserProfileDtoSchema,
) {}
