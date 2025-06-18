/**
 * Доменный сервис для управления доступом к данным пользователей.
 *
 * Отвечает за:
 * - Сохранение зашифрованных данных для доступа кооперативов
 * - Получение запросов доступа по различным критериям
 * - Отзыв доступа к данным пользователя
 * - Управление жизненным циклом запросов доступа
 *
 * Реализует бизнес-логику для безопасного обмена зашифрованными
 * данными между пользователями и кооперативами.
 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ACCESS_REQUEST_REPOSITORY,
  AccessRequestRepository,
} from '../repositories/access-request.repository';
import { AccessRequest } from '../entities/access-request.entity';

@Injectable()
export class AccessDomainService {
  constructor(
    @Inject(ACCESS_REQUEST_REPOSITORY)
    private readonly accessRequestRepository: AccessRequestRepository,
  ) {}

  /**
   * Сохраняет зашифрованные данные карты пользователя.
   *
   * Если запрос доступа для пары username-coopname уже существует,
   * он будет обновлен новыми данными. Метод возвращает одноразовый
   * билет, который используется для получения JWT токена.
   *
   * @param accessRequest - Объект запроса доступа с зашифрованными данными
   * @returns Уникальный идентификатор (ticket) для получения доступа
   */
  async saveEncryptedCard(accessRequest: AccessRequest): Promise<string> {
    // Проверяем, существует ли уже AccessRequest для данной пары username и coopname
    const existingAccessRequest =
      await this.accessRequestRepository.findByUsernameAndCoopName(
        accessRequest.username,
        accessRequest.coopname,
      );

    await this.accessRequestRepository.save(accessRequest);

    return accessRequest.ticket;
  }

  /**
   * Получает запрос доступа по одноразовому билету.
   *
   * Используется при обмене билета на JWT токен для
   * проверки валидности билета.
   *
   * @param ticket - Уникальный идентификатор билета
   * @returns Запрос доступа или null, если билет недействителен
   */
  async getAccessRequestByTicket(
    ticket: string,
  ): Promise<AccessRequest | null> {
    const request = await this.accessRequestRepository.findByTicket(ticket);
    return request;
  }

  /**
   * Получает запрос доступа по имени пользователя и кооперативу.
   *
   * Используется кооперативами для получения зашифрованных данных
   * конкретного пользователя после аутентификации.
   *
   * @param username - Имя пользователя карты
   * @param coopname - Имя кооператива
   * @returns Объект запроса доступа с зашифрованными данными
   * @throws BadRequestException - если доступ не найден (отозван или не выдан)
   */
  async getAccessRequestByUsernameAndCoopname(
    username: string,
    coopname: string,
  ): Promise<AccessRequest> {
    const request =
      await this.accessRequestRepository.findByUsernameAndCoopName(
        username,
        coopname,
      );

    if (!request) {
      throw new BadRequestException(
        'В доступе отказано по причине того, что он был отозван или не выдан',
      );
    }

    return request;
  }

  /**
   * Отзывает доступ кооператива к данным пользователя.
   *
   * Удаляет запись запроса доступа, что предотвращает дальнейшую
   * возможность кооператива получать данные пользователя.
   *
   * @param username - Имя пользователя карты
   * @param coopname - Имя кооператива
   */
  async revokeAccess(username: string, coopname: string): Promise<void> {
    await this.accessRequestRepository.deleteByUsernameAndCoopName(
      username,
      coopname,
    );
  }

  /**
   * Получает список всех запросов доступа для указанного пользователя.
   *
   * Возвращает информацию обо всех кооперативах, которым
   * пользователь предоставил доступ к своим данным.
   *
   * @param username - Имя пользователя
   * @returns Массив запросов доступа
   */
  async listAccesses(username: string): Promise<AccessRequest[]> {
    return this.accessRequestRepository.findByUsername(username);
  }
}
