import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '@pwa/shared';
import { User } from '../schemas/user.schema';
import { UserService } from '../user.service';
import { config } from '../../config/env';

@Injectable()
export class UserSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(
    private userService: UserService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.verbose('OnApplicationBootstrap');
    await this.seedInitialAdminUser();
  }

  private async seedInitialAdminUser() {
    const existingAdmins = await this.userModel.find({
      role: Role.Admin,
    });

    if (existingAdmins.length >= 1) {
      this.logger.debug('Admin user(s) already exist, skipping seed.');
      return;
    }

    this.logger.log('Creating initial admin user');
    try {
      await this.userService.create({
        role: Role.Admin,
        name: config.seed.initialAdminUser.name,
        email: config.seed.initialAdminUser.email,
        password: config.seed.initialAdminUser.password,
      });
      this.logger.log('Initial admin user created successfully');
    } catch (e) {
      this.logger.error('Failed to create initial admin user', e?.stack);
    }
  }
}
