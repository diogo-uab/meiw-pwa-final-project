import {
  Logger,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  Role,
  AuthResponseDtoType,
  RefreshTokenRequestDtoType,
} from '@pwa/shared';
import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login.dto';
import { RegisterRequestDto } from './dto/register.dto';
import { UserDocument } from '../user/schemas/user.schema';
import { config } from '../config/env';
import { JWTPayload } from './types';

type AuthResponseDto = Omit<AuthResponseDtoType, 'user'> & {
  user: UserDocument;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userService.getByEmail(loginDto.email).catch(() => {
      this.logger.verbose('Could not find user by email');
      throw new UnauthorizedException('Incorrect email/password combination');
    });

    if (
      !(await this.userService.comparePassword(
        loginDto.password,
        user.password,
      ))
    ) {
      this.logger.verbose('Incorrect password');
      throw new UnauthorizedException('Incorrect email/password combination');
    }

    const jwt = await this.generateJWT(user);
    return { ...jwt, user };
  }

  async register(registerDto: RegisterRequestDto): Promise<AuthResponseDto> {
    if (
      await this.userService.getByEmail(registerDto.email).catch(() => null)
    ) {
      throw new ConflictException(
        'User with the provided email already exists',
      );
    }

    this.logger.verbose('Registering new user');
    const user = await this.userService.create({
      ...registerDto,
      role: Role.User,
    });

    const jwt = await this.generateJWT(user);
    return { ...jwt, user };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenRequestDtoType,
  ): Promise<AuthResponseDto> {
    try {
      const payload: JWTPayload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        { secret: config.auth.jwtSecret },
      );

      if (payload.type !== 'refresh')
        throw new Error('JWT is not a refresh token');

      const user = await this.userService.getById(payload.sub);
      const jwt = await this.generateJWT(user);
      return { ...jwt, user };
    } catch (e) {
      this.logger.error(`Error refreshig JWT: ${e?.message}`, e?.stack);
      throw new UnauthorizedException();
    }
  }

  private async generateJWT(
    user: UserDocument,
  ): Promise<Omit<AuthResponseDtoType, 'user'>> {
    this.logger.verbose('Creating new JWT');

    const accessTokenPayload: JWTPayload = {
      sub: user._id.toString(),
      email: user.email,
      type: 'access',
    };
    const accessTokenExpiresAt = new Date(
      new Date().getTime() + config.auth.jwtAccessDurationSeconds * 1000,
    ).toISOString();
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);

    const refreshTokenPayload = {
      ...accessTokenPayload,
      type: 'refresh',
    };
    const refreshTokenExpiresAt = new Date(
      new Date().getTime() + config.auth.jwtRefreshDurationSeconds * 1000,
    ).toISOString();
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: config.auth.jwtRefreshDurationSeconds,
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  }
}
