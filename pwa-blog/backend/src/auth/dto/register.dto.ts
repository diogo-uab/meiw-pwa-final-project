import { createZodDto } from 'nestjs-zod';
import { RegisterRequestDtoSchema } from '@pwa/shared';

export class RegisterRequestDto extends createZodDto(
  RegisterRequestDtoSchema,
) {}
