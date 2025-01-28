import { createZodDto } from 'nestjs-zod';
import { UserDtoSchema } from '@pwa/shared';

export class UserDto extends createZodDto(UserDtoSchema) {}
