import { createZodDto } from 'nestjs-zod';
import { RefreshTokenRequestDtoSchema } from '@pwa/shared';

export class RefreshTokenResponseDto extends createZodDto(
  RefreshTokenRequestDtoSchema,
) {}
