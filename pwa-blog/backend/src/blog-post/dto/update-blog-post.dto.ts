import { createZodDto } from 'nestjs-zod';
import { UpdateBlogPostDtoSchema } from '@pwa/shared';

export class UpdateBlogPostDto extends createZodDto(UpdateBlogPostDtoSchema) {}
