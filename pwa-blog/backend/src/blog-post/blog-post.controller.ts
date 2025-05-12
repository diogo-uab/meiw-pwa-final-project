import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Controller,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Role } from '@pwa/shared';
import { BlogPostService } from './blog-post.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { IdDto } from '../shared/dto/id.dto';
import { LocationQuerySchema } from './dto/location.dto';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPostResponseDto } from './dto/blog-post-response.dto';

@Controller('blog-post')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get()
  @ZodSerializerDto(BlogPostResponseDto)
  getAll(@Query('search') search?: string, @Query() locationQuery?: unknown) {
    const { data: location } = LocationQuerySchema.safeParse(locationQuery);
    return this.blogPostService.getAll(search, location);
  }

  @Get(':id')
  @ZodSerializerDto(BlogPostResponseDto)
  getById(@Param() params: IdDto) {
    return this.blogPostService.getById(params.id);
  }

  @Post()
  @Auth(Role.Admin)
  @ZodSerializerDto(BlogPostResponseDto)
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.create(createBlogPostDto);
  }

  @Put(':id')
  @Auth(Role.Admin)
  @ZodSerializerDto(BlogPostResponseDto)
  update(@Param() params: IdDto, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    return this.blogPostService.update(params.id, updateBlogPostDto);
  }

  @Delete(':id')
  @Auth(Role.Admin)
  async delete(@Param() params: IdDto) {
    await this.blogPostService.delete(params.id);
    return { success: true };
  }
}
