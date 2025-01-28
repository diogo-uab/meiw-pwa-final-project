import { createZodDto } from 'nestjs-zod';
import { CreateUserDtoSchema } from '@pwa/shared';

export class CreateUserDto extends createZodDto(CreateUserDtoSchema) {}
