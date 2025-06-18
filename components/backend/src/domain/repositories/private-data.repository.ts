import type { PrivateData } from '../entities/private-data.entity';

/**
 * Интерфейс репозитория для работы с приватными данными
 * Определяет методы для сохранения, обновления и поиска данных
 */
export interface PrivateDataRepository {
  save(data: Partial<PrivateData>): Promise<PrivateData>;
  findById(id: string): Promise<PrivateData | null>;
  findByUserId(user_id: string): Promise<PrivateData | null>;
  update(id: string, data: Partial<PrivateData>): Promise<PrivateData>;
}

export const PRIVATE_DATA_REPOSITORY = Symbol('PrivateDataRepository');
