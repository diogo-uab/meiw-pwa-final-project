import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';
import { ZodSerializerDto } from 'nestjs-zod';
import { Role } from '@pwa/shared';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserDocument } from './schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserDto } from './dto/user.dto';
import {
  VerifyAvailableEmailRequestDto,
  VerifyAvailableEmailResponseDto,
} from './dto/verify-available-email.dto';
import { IdDto } from '../shared/dto/id.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @Auth()
  @ZodSerializerDto(UserDto)
  getMyUserInfo(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Post('profile')
  @Auth()
  @ZodSerializerDto(UserDto)
  updateUserProfile(
    @CurrentUser() user: UserDocument,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(user, updateUserProfileDto);
  }

  @Post('password')
  @Auth()
  async updateUserPassword(
    @CurrentUser() user: UserDocument,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    await this.userService.updateUserPassword(user, updateUserPasswordDto);
    return { success: true };
  }

  @Post('verify-available-email')
  @HttpCode(HttpStatus.OK)
  @ZodSerializerDto(VerifyAvailableEmailResponseDto)
  async verifyAvailableEmail(
    @Body() verifyAvailableEmailDto: VerifyAvailableEmailRequestDto,
  ): Promise<VerifyAvailableEmailResponseDto> {
    const isAvailable = await this.userService.verifyAvailableEmail(
      verifyAvailableEmailDto,
    );
    return { isAvailable };
  }

  @Get()
  @Auth(Role.Admin)
  @ZodSerializerDto(UserDto)
  getAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @Auth(Role.Admin)
  @ZodSerializerDto(UserDto)
  async getById(@Param() params: IdDto) {
    return this.userService.getById(params.id);
  }

  @Post()
  @Auth(Role.Admin)
  @ZodSerializerDto(UserDto)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @Auth(Role.Admin)
  @ZodSerializerDto(UserDto)
  async update(@Param() params: IdDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(params.id, updateUserDto);
  }

  @Delete(':id')
  @Auth(Role.Admin)
  async delete(@Param() params: IdDto) {
    await this.userService.delete(params.id);
    return { success: true };
  }
}
