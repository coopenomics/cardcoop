import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateDataORM } from '../entities/private-data.orm-entity';
import { PrivateDataRepository } from '../../../domain/repositories/private-data.repository';
import { PrivateData } from 'src/domain/entities/private-data.entity';

/**
 * Реализация репозитория для работы с приватными данными
 */
@Injectable()
export class PrivateDataRepositoryImpl implements PrivateDataRepository {
  constructor(
    @InjectRepository(PrivateDataORM)
    private readonly repository: Repository<PrivateDataORM>,
  ) {}

  /**
   * Сохраняет приватные данные в БД
   * @param data Объект приватных данных (частичный)
   * @returns Сохраненные приватные данные
   */
  async save(data: Partial<PrivateData>): Promise<PrivateData> {
    const savedData = await this.repository.save(data);
    return new PrivateData(savedData);
  }

  /**
   * Ищет приватные данные по ID
   * @param id ID приватных данных
   * @returns Объект приватных данных или null
   */
  async findById(id: string): Promise<PrivateData | null> {
    const result = await this.repository.findOne({ where: { id } });
    return result ? new PrivateData(result) : null;
  }

  /**
   * Ищет приватные данные по ID пользователя
   * @param user_id ID пользователя
   * @returns Объект приватных данных или null
   */
  async findByUserId(user_id: string): Promise<PrivateData | null> {
    const result = await this.repository.findOne({ where: { user_id } });
    return result ? new PrivateData(result) : null;
  }

  /**
   * Обновляет приватные данные
   * @param id ID приватных данных
   * @param data Обновляемые поля
   * @returns Обновленный объект приватных данных
   */
  async update(id: string, data: Partial<PrivateData>): Promise<PrivateData> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Private data with id ${id} not found after update`);
    }
    return new PrivateData(updated);
  }
}
