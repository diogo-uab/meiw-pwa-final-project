import { createZodDto } from 'nestjs-zod';
import { UpdateUserDtoSchema } from '@pwa/shared';

export class UpdateUserDto extends createZodDto(UpdateUserDtoSchema) {}
