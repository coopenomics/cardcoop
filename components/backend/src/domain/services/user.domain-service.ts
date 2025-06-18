/**
 * Доменный сервис пользователя - содержит основную бизнес-логику работы с пользователями.
 *
 * Отвечает за:
 * - Регистрацию новых пользователей
 * - Аутентификацию существующих пользователей
 * - Управление токенами JWT и UUID
 * - Проверку и обновление токенов доступа
 */
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

  /**
   * Инициирует процесс регистрации нового пользователя.
   *
   * @param email - Email адрес для регистрации
   * @returns Данные для продолжения регистрации (uuid и соль)
   * @throws BadRequestException - если пользователь уже существует
   */
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

  /**
   * Завершает процесс регистрации нового пользователя.
   *
   * @param email - Email нового пользователя
   * @param hash_key - Хешированный ключ доступа
   * @param uuid - UUID из этапа инициализации
   * @param salt - Соль для хеширования из этапа инициализации
   * @returns Токены доступа (access и refresh)
   * @throws BadRequestException - если UUID недействителен или истек
   */
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

  /**
   * Инициирует процесс входа пользователя.
   *
   * @param email - Email пользователя
   * @returns Данные для продолжения входа (uuid и соль)
   * @throws BadRequestException - если пользователь не найден
   */
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

  /**
   * Завершает процесс входа пользователя.
   *
   * @param email - Email пользователя
   * @param hash_key - Хешированный ключ доступа
   * @param uuid - UUID из этапа инициализации
   * @returns Токены доступа (access и refresh)
   * @throws Error - если UUID недействителен или учетные данные неверны
   */
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

  /**
   * Выполняет выход пользователя, инвалидируя токены.
   *
   * @param data - Данные для выхода (токены доступа)
   */
  async logout(data: LogoutInputDomainInterface): Promise<void> {
    await this.jwtTokenRepository.revokeJwt(data.access_token);
    await this.jwtTokenRepository.revokeJwt(data.refresh_token);
  }

  /**
   * Обновляет токены доступа по refresh токену.
   *
   * @param refreshToken - Текущий refresh токен
   * @returns Новые токены доступа (access и refresh)
   * @throws BadRequestException - если токен недействителен или отозван
   */
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

  /**
   * Отзывает JWT токен.
   *
   * @param jwtToken - Токен для отзыва
   */
  async revokeJwt(jwtToken: string) {
    await this.jwtTokenRepository.revokeJwt(jwtToken);
  }

  /**
   * Отзывает UUID токен.
   *
   * @param uuid - UUID для отзыва
   */
  async revokeUuid(uuid: string) {
    await this.uuidTokenRepository.revokeUuid(uuid);
  }

  /**
   * Генерирует access токен для пользователя.
   *
   * @param user_id - ID пользователя
   * @returns JWT access токен
   */
  private generateAccessToken(user_id: string): string {
    return jwt.sign(
      {
        sub: user_id,
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000),
      },
      this.config.jwtSecret,
      {
        expiresIn: `${this.config.accessTokenExpirationDays}d`,
      },
    );
  }

  /**
   * Генерирует refresh токен для пользователя.
   *
   * @param user_id - ID пользователя
   * @returns JWT refresh токен
   */
  private generateRefreshToken(user_id: string): string {
    return jwt.sign(
      {
        sub: user_id,
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000),
      },
      this.config.jwtSecret,
      {
        expiresIn: `${this.config.refreshTokenExpirationDays}d`,
      },
    );
  }

  /**
   * Вычисляет дату, отстоящую от текущей на заданное количество дней.
   *
   * @param days - Количество дней
   * @returns Дата в будущем
   */
  private datePlusDays(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }
}
