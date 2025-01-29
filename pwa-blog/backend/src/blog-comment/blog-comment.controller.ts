import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  Controller,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { BlogCommentService } from './blog-comment.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { IdDto } from '../shared/dto/id.dto';
import {
  CreateBlogCommentDto,
  UpdateBlogCommentDto,
} from './dto/create-update-blog-comment.dto';
import { BlogCommentResponseDto } from './dto/blog-comment-response.dto';

@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get(':id')
  @ZodSerializerDto(BlogCommentResponseDto)
  getById(@Param() params: IdDto) {
    return this.blogCommentService.getById(params.id);
  }

  @Get('post/:id')
  getAllByPostId(@Param() params: IdDto) {
    return this.blogCommentService.getAllByPostId(params.id);
  }

  @Auth()
  @Get('user/:id')
  getAllByUserId(@Param() params: IdDto) {
    return this.blogCommentService.getAllByUserId(params.id);
  }

  @Auth()
  @Post()
  @ZodSerializerDto(BlogCommentResponseDto)
  create(
    @CurrentUser() user: UserDocument,
    @Body() createBlogCommentDto: CreateBlogCommentDto,
  ) {
    return this.blogCommentService.create(user, createBlogCommentDto);
  }

  @Auth()
  @Put(':id')
  @ZodSerializerDto(BlogCommentResponseDto)
  update(
    @Param() params: IdDto,
    @CurrentUser() user: UserDocument,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
  ) {
    return this.blogCommentService.update(
      params.id,
      user,
      updateBlogCommentDto,
    );
  }

  @Auth()
  @Delete(':id')
  async delete(@Param() params: IdDto, @CurrentUser() user: UserDocument) {
    await this.blogCommentService.delete(params.id, user);
    return { success: true };
  }
}
