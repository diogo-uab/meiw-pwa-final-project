import { createZodDto } from 'nestjs-zod';
import { RefreshTokenRequestDtoSchema } from '@pwa/shared';

export class RefreshTokenRequestDto extends createZodDto(
  RefreshTokenRequestDtoSchema,
) {}
