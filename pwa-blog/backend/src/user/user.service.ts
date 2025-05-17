import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  Logger,
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { VerifyAvailableEmailRequestDtoType } from '@pwa/shared';
import { config } from '../config/env';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UserDeletedEvent } from './events/user-deleted.event';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User for the given id not found');
    return user;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user)
      throw new NotFoundException('User for the given email not found');
    return user;
  }

  async updateUserProfile(
    user: UserDocument,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<UserDocument> {
    if (
      user.email !== updateUserProfileDto.email &&
      !(await this.verifyAvailableEmail({ email: updateUserProfileDto.email }))
    ) {
      throw new ConflictException(
        'User with the provided email already exists',
      );
    }

    user.set(updateUserProfileDto);
    return user.save();
  }

  async updateUserPassword(
    user: UserDocument,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    if (
      !(await this.comparePassword(
        updateUserPasswordDto.currentPassword,
        user.password,
      ))
    )
      throw new ForbiddenException('Current password is incorrect');

    await user.updateOne({
      password: await this.hashPassword(updateUserPasswordDto.newPassword),
    });
  }

  async create(user: CreateUserDto): Promise<UserDocument> {
    if (await this.getByEmail(user.email).catch(() => null)) {
      throw new ConflictException(
        'User with the provided email already exists',
      );
    }

    return this.userModel.create({
      ...user,
      password: await this.hashPassword(user.password),
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const user = await this.getById(id);
    if (
      user.email !== updateUserDto.email &&
      !(await this.verifyAvailableEmail(updateUserDto))
    ) {
      throw new ConflictException(
        'User with the provided email already exists',
      );
    }

    user.set(updateUserDto);
    return user.save();
  }

  async delete(id: string) {
    const user = await this.getById(id);
    await user.deleteOne();

    this.logger.verbose(`Emmiting UserDeleteEvent for user: ${id}`);
    this.eventEmitter.emit(
      UserDeletedEvent.EVENT,
      new UserDeletedEvent(id, user),
    );
  }

  async verifyAvailableEmail(
    verifyAvailableEmailDto: VerifyAvailableEmailRequestDtoType,
  ): Promise<boolean> {
    try {
      await this.getByEmail(verifyAvailableEmailDto.email);
      return false;
    } catch {
      return true;
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.auth.passwordSaltOrRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (e) {
      this.logger.error('Failed to compare password', e?.stack);
    }
    return false;
  }
}
