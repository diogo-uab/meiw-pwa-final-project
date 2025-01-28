import { createZodDto } from 'nestjs-zod';
import {
  VerifyAvailableEmailRequestDtoSchema,
  VerifyAvailableEmailResponseDtoSchema,
} from '@pwa/shared';

export class VerifyAvailableEmailRequestDto extends createZodDto(
  VerifyAvailableEmailRequestDtoSchema,
) {}

export class VerifyAvailableEmailResponseDto extends createZodDto(
  VerifyAvailableEmailResponseDtoSchema,
) {}
