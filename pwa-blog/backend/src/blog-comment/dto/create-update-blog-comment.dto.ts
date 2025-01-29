import { createZodDto } from 'nestjs-zod';
import {
  CreateBlogCommentDtoSchema,
  UpdateBlogCommentDtoSchema,
} from '@pwa/shared';

export class CreateBlogCommentDto extends createZodDto(
  CreateBlogCommentDtoSchema,
) {}

export class UpdateBlogCommentDto extends createZodDto(
  UpdateBlogCommentDtoSchema,
) {}
