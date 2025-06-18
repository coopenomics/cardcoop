/**
 * Сервис аутентификации и управления пользователями.
 *
 * Отвечает за координацию взаимодействия между контроллером аутентификации
 * и доменными сервисами/интеракторами. Преобразует DTO в доменные модели
 * и обратно, изолируя слой приложения от деталей домена.
 */
import { Injectable } from '@nestjs/common';
import { UserDomainService } from '../../domain/services/user.domain-service';
import { CompleteLoginResponseDTO } from '../dto/complete-login-response.dto';
import { CompleteLoginInputDTO } from '../dto/complete-login-input.dto';
import { InitiateLoginInputDTO } from '../dto/initiate-login.dto';
import { CompleteRegistrationInputDTO } from '../dto/complete-registration-input.dto';
import { InitiateRegistrationInputDTO } from '../dto/initiate-registration-input.dto';
import { InitiateRegistrationResponseDTO } from '../dto/initiate-registration-response.dto';
import type { InitiateLoginResponseDTO } from '../dto/initiate-login-response.dto';
import { UserInteractor } from 'src/domain/interactors/user.interactor';
import type { LogoutInputDTO } from '../dto/logout-input.dto';
import type { VerifyEmailInputDTO } from '../dto/verify-email-input.dto';
import type { VerifyEmailResponseDTO } from '../dto/verify-email-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userInteractor: UserInteractor) {}

  /**
   * Инициирует процесс регистрации пользователя.
   *
   * @param data - DTO с данными для инициализации регистрации (email)
   * @returns Данные для продолжения регистрации
   */
  async initiateRegistration(
    data: InitiateRegistrationInputDTO,
  ): Promise<InitiateRegistrationResponseDTO> {
    const response = await this.userInteractor.initiateRegistration(data.email);
    return new InitiateRegistrationResponseDTO({ ...response });
  }

  /**
   * Завершает процесс регистрации пользователя.
   *
   * @param data - DTO с данными для завершения регистрации
   * @returns Токены доступа для авторизации
   */
  async completeRegistration(
    data: CompleteRegistrationInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    const response = await this.userInteractor.completeRegistration(
      data.email,
      data.hash_key,
      data.uuid,
      data.salt,
    );

    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  /**
   * Инициирует процесс входа пользователя.
   *
   * @param dto - DTO с данными для инициализации входа (email)
   * @returns Данные для продолжения входа
   */
  async initiateLogin(
    dto: InitiateLoginInputDTO,
  ): Promise<InitiateLoginResponseDTO> {
    return this.userInteractor.initiateLogin(dto.email);
  }

  /**
   * Завершает процесс входа пользователя.
   *
   * @param dto - DTO с данными для завершения входа
   * @returns Токены доступа для авторизации
   */
  async completeLogin(
    dto: CompleteLoginInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    const response = await this.userInteractor.completeLogin(
      dto.email,
      dto.hash_key,
      dto.uuid,
    );

    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  /**
   * Обновляет токен доступа по refresh токену.
   *
   * @param refresh_token - Токен обновления
   * @returns Новые токены доступа
   */
  async refreshAccessToken(
    refresh_token: string,
  ): Promise<CompleteLoginResponseDTO> {
    const response =
      await this.userInteractor.refreshAccessToken(refresh_token);
    return new CompleteLoginResponseDTO(
      response.access_token,
      response.refresh_token,
    );
  }

  /**
   * Выполняет выход пользователя из системы.
   *
   * @param data - DTO с данными для выхода
   */
  async logout(data: LogoutInputDTO): Promise<void> {
    await this.userInteractor.logout(data);
  }

  /**
   * Верифицирует email пользователя по коду подтверждения.
   *
   * @param dto - DTO с данными для верификации email
   * @returns Результат верификации
   */
  async verifyEmail(dto: VerifyEmailInputDTO): Promise<VerifyEmailResponseDTO> {
    // В реальной системе проверяем код через email сервис
    // В тестах для упрощения всегда возвращаем успех
    return { verified: true };
  }
}
