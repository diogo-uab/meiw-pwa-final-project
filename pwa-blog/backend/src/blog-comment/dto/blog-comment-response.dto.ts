import { BlogCommentResponseDtoSchema } from '@pwa/shared';
import { createZodDto } from 'nestjs-zod';

export class BlogCommentResponseDto extends createZodDto(
  BlogCommentResponseDtoSchema,
) {}
