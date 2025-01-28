import { createZodDto } from 'nestjs-zod';
import { AuthResponseDtoSchema } from '@pwa/shared';

export class AuthResponseDto extends createZodDto(AuthResponseDtoSchema) {}
