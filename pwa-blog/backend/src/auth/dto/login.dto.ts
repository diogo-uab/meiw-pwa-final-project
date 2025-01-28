import { createZodDto } from 'nestjs-zod';
import { LoginRequestDtoSchema } from '@pwa/shared';

export class LoginRequestDto extends createZodDto(LoginRequestDtoSchema) {}
