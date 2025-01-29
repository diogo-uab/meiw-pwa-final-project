import { CreateBlogPostDtoSchema } from '@pwa/shared';
import { createZodDto } from 'nestjs-zod';

export class CreateBlogPostDto extends createZodDto(CreateBlogPostDtoSchema) {}
