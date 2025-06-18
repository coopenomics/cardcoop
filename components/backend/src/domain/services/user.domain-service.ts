import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
import * as jwt from 'jsonwebtoken';
import {
  JWT_TOKEN_REPOSITORY,
  JwtTokenRepository,
} from '../repositories/jwt-token.repository';
import {
  UUID_TOKEN_REPOSITORY,
  UuidTokenRepository,
} from '../repositories/uuid-token.repository';
import { User } from '../entities/user.entity';
import { ConfigService } from 'src/infrastructure/config/config.service';
import type { LogoutInputDomainInterface } from '../interfaces/logout-input.interface';

@Injectable()
export class UserDomainService {
  constructor(
    private readonly config: ConfigService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(JWT_TOKEN_REPOSITORY)
    private readonly jwtTokenRepository: JwtTokenRepository,
    @Inject(UUID_TOKEN_REPOSITORY)
    private readonly uuidTokenRepository: UuidTokenRepository,
  ) {}

  async initiateRegistration(email: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const salt = uuidv4();
    const uuid = uuidv4();
    await this.uuidTokenRepository.saveUuid(
      uuid,
      new Date(Date.now() + this.config.uuidRegExpirationMs),
    );

    return { uuid, salt };
  }

  async completeRegistration(
    email: string,
    hash_key: string,
    uuid: string,
    salt: string,
  ) {
    const isValidUuid = await this.uuidTokenRepository.isUuidValid(uuid);

    if (!isValidUuid) throw new BadRequestException('Invalid or expired uuid');

    const user = new User({
      id: uuidv4(),
      email,
      salt,
      hash_key,
    });

    await this.userRepository.create(user);

    const access_token = this.generateAccessToken(user.id);
    const refresh_token = this.generateRefreshToken(user.id);

    // Сохраняем JWT токены
    await this.jwtTokenRepository.saveJwt(
      access_token,
      this.datePlusDays(this.config.accessTokenExpirationDays),
    );
    await this.jwtTokenRepository.saveJwt(
      refresh_token,
      this.datePlusDays(this.config.refreshTokenExpirationDays),
    );

    return { access_token, refresh_token };
  }

  async initiateLogin(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const uuid = uuidv4();
    await this.uuidTokenRepository.saveUuid(
      uuid,
      new Date(Date.now() + this.config.uuidLoginExpirationMs),
    );

    return { uuid, salt: user.salt };
  }

  async completeLogin(email: string, hash_key: string, uuid: string) {
    const isValidUuid = await this.uuidTokenRepository.isUuidValid(uuid);
    if (!isValidUuid) throw new Error('Invalid or expired uuid');

    const user = await this.userRepository.findByEmail(email);
    if (!user || user.hash_key !== hash_key) {
      throw new Error('Invalid credentials');
    }

    const access_token = this.generateAccessToken(user.id);
    const refresh_token = this.generateRefreshToken(user.id);

    await this.jwtTokenRepository.saveJwt(
      access_token,
      this.datePlusDays(this.config.accessTokenExpirationDays),
    );
    await this.jwtTokenRepository.saveJwt(
      refresh_token,
      this.datePlusDays(this.config.refreshTokenExpirationDays),
    );

    return { access_token, refresh_token };
  }

  async logout(data: LogoutInputDomainInterface): Promise<void> {
    await this.jwtTokenRepository.revokeJwt(data.access_token);
    await this.jwtTokenRepository.revokeJwt(data.refresh_token);
  }

  async refreshAccessToken(refreshToken: string) {
    const isValid = await this.jwtTokenRepository.isJwtValid(refreshToken);
    if (!isValid)
      throw new BadRequestException('Invalid or revoked refresh token');

    try {
      const payload = jwt.verify(refreshToken, this.config.jwtSecret) as any;
      const user_id = payload.sub;

      const access_token = this.generateAccessToken(user_id);
      const newRefreshToken = this.generateRefreshToken(user_id);

      await this.jwtTokenRepository.saveJwt(
        access_token,
        this.datePlusDays(this.config.accessTokenExpirationDays),
      );
      await this.jwtTokenRepository.saveJwt(
        newRefreshToken,
        this.datePlusDays(this.config.refreshTokenExpirationDays),
      );

      return { access_token, refresh_token: newRefreshToken };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async revokeJwt(jwtToken: string) {
    await this.jwtTokenRepository.revokeJwt(jwtToken);
  }

  async revokeUuid(uuid: string) {
    await this.uuidTokenRepository.revokeUuid(uuid);
  }

  private generateAccessToken(user_id: string): string {
    return jwt.sign({ sub: user_id }, this.config.jwtSecret, {
      expiresIn: `${this.config.accessTokenExpirationDays}d`,
    });
  }

  private generateRefreshToken(user_id: string): string {
    return jwt.sign({ sub: user_id }, this.config.jwtSecret, {
      expiresIn: `${this.config.refreshTokenExpirationDays}d`,
    });
  }

  private datePlusDays(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
