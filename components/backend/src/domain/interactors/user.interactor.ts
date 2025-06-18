/**
 * Интерактор пользователя - реализует сценарии использования (use cases) для пользователя.
 *
 * Интерактор оркестрирует вызовы доменных сервисов для реализации бизнес-сценариев,
 * связанных с пользователями. Выступает единой точкой доступа к функциям работы
 * с пользователями для слоя приложения.
 */
import { Injectable } from '@nestjs/common';
import type { InitiateRegistrationDomainReposponseInterface } from '../interfaces/initiate-registration-domain.interface';
import type { InitiateLoginDomainReposponseInterface } from '../interfaces/initiate-login-domain.interface';
import type { CompleteLoginResponseDomainInterface } from '../interfaces/compete-login-domain.interface';
import { UserDomainService } from '../services/user.domain-service';
import type { LogoutInputDomainInterface } from '../interfaces/logout-input.interface';

@Injectable()
export class UserInteractor {
  constructor(private readonly userDomainService: UserDomainService) {}

  /**
   * Инициирует процесс регистрации пользователя.
   *
   * @param email - Email адрес для регистрации
   * @returns Данные для продолжения процесса регистрации
   */
  async initiateRegistration(
    email: string,
  ): Promise<InitiateRegistrationDomainReposponseInterface> {
    return this.userDomainService.initiateRegistration(email);
  }

  /**
   * Завершает процесс регистрации пользователя.
   *
   * @param email - Email пользователя
   * @param hash_key - Хешированный ключ пользователя
   * @param uuid - Уникальный идентификатор регистрации
   * @param salt - Соль для хеширования
   * @returns Токены доступа
   */
  async completeRegistration(
    email: string,
    hash_key: string,
    uuid: string,
    salt: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.completeRegistration(
      email,
      hash_key,
      uuid,
      salt,
    );
  }

  /**
   * Инициирует процесс входа пользователя.
   *
   * @param email - Email пользователя
   * @returns Данные для продолжения процесса входа
   */
  async initiateLogin(
    email: string,
  ): Promise<InitiateLoginDomainReposponseInterface> {
    return this.userDomainService.initiateLogin(email);
  }

  /**
   * Завершает процесс входа пользователя.
   *
   * @param email - Email пользователя
   * @param hash_key - Хешированный ключ пользователя
   * @param uuid - Уникальный идентификатор сессии
   * @returns Токены доступа
   */
  async completeLogin(
    email: string,
    hash_key: string,
    uuid: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.completeLogin(email, hash_key, uuid);
  }

  /**
   * Обновляет токен доступа по refresh токену.
   *
   * @param refreshToken - Токен обновления
   * @returns Новые токены доступа
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<CompleteLoginResponseDomainInterface> {
    return this.userDomainService.refreshAccessToken(refreshToken);
  }

  /**
   * Выполняет выход пользователя из системы.
   *
   * @param data - Данные для выхода
   */
  async logout(data: LogoutInputDomainInterface): Promise<void> {
    return this.userDomainService.logout(data);
  }
}
