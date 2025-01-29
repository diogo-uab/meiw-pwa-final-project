import { createZodDto } from 'nestjs-zod';
import { BlogPostResponseDtoSchema } from '@pwa/shared';

export class BlogPostResponseDto extends createZodDto(
  BlogPostResponseDtoSchema,
) {}
