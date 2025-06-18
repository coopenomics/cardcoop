import { Inject, Injectable } from '@nestjs/common';
import {
  PRIVATE_DATA_REPOSITORY,
  PrivateDataRepository,
} from '../repositories/private-data.repository';
import { PrivateData } from '../entities/private-data.entity';
import { sha256 } from 'src/utils/createHash';
import { v4 } from 'uuid';

/**
 * Доменный сервис для работы с приватными данными пользователей
 */
@Injectable()
export class PrivateDataDomainService {
  constructor(
    @Inject(PRIVATE_DATA_REPOSITORY)
    private readonly privateDataRepository: PrivateDataRepository,
  ) {}

  /**
   * Создает новую запись с приватными данными пользователя
   *
   * @param user_id ID пользователя
   * @param encrypted_data Зашифрованные данные
   * @param meta Метаданные
   * @returns Сохраненный объект приватных данных
   */
  async createPrivateData(
    user_id: string,
    encrypted_data: string,
    meta: any,
  ): Promise<PrivateData> {
    // Проверяем, что user_id определен
    if (!user_id) {
      throw new Error('User ID is required for private data');
    }

    // Хеширование данных для проверки целостности
    const data_hash = sha256(encrypted_data);

    // Создаем объект приватных данных
    const privateData = new PrivateData({
      id: v4(),
      user_id,
      encrypted_data,
      data_hash,
      meta: {
        ...meta,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Проверяем, есть ли уже приватные данные для этого пользователя
    const existingData = await this.privateDataRepository.findByUserId(user_id);

    // Если данные уже существуют, обновляем их
    if (existingData) {
      return this.privateDataRepository.update(existingData.id, {
        encrypted_data,
        data_hash,
        meta: {
          ...meta,
          created_at: existingData.meta.created_at,
          updated_at: new Date(),
        },
      });
    }

    // Если данных нет, создаем новые
    return this.privateDataRepository.save(privateData);
  }

  /**
   * Получает приватные данные пользователя
   *
   * @param user_id ID пользователя
   * @returns Объект приватных данных или null
   */
  async getPrivateDataByUserId(user_id: string): Promise<PrivateData | null> {
    return this.privateDataRepository.findByUserId(user_id);
  }

  /**
   * Получает приватные данные по ID
   *
   * @param id ID приватных данных
   * @returns Объект приватных данных или null
   */
  async getPrivateDataById(id: string): Promise<PrivateData | null> {
    return this.privateDataRepository.findById(id);
  }

  /**
   * Обновляет приватные данные
   *
   * @param id ID приватных данных
   * @param encrypted_data Новые зашифрованные данные
   * @param meta Новые метаданные
   * @returns Обновленный объект приватных данных
   */
  async updatePrivateData(
    id: string,
    encrypted_data: string,
    meta: any,
  ): Promise<PrivateData> {
    const currentData = await this.privateDataRepository.findById(id);
    if (!currentData) {
      throw new Error(`Private data with ID ${id} not found`);
    }

    const data_hash = sha256(encrypted_data);

    return this.privateDataRepository.update(id, {
      encrypted_data,
      data_hash,
      meta: {
        ...meta,
        created_at: currentData.meta.created_at,
        updated_at: new Date(),
      },
    });
  }
}
