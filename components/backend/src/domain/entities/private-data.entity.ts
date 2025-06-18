import { BadRequestException } from '@nestjs/common';
import type { PrivateDataMetaInterface } from '../interfaces/private-data-meta.interface';
import { PrivateDataMetaSchema } from '../schemas/private-data-meta.schema';

/**
 * Сущность приватных данных пользователя
 * Хранит зашифрованные персональные данные, которые могут быть доступны
 * через разные карты пользователя
 */
export class PrivateData {
  id!: string;
  user_id!: string;
  encrypted_data!: string; // Зашифрованные персональные данные
  data_hash!: string; // Хеш данных для верификации
  meta!: PrivateDataMetaInterface; // Метаданные

  constructor(data: PrivateData) {
    Object.assign(this, data);

    const validationResult = PrivateDataMetaSchema.safeParse(data.meta);
    if (!validationResult.success) {
      throw new BadRequestException(
        `Invalid meta: ${validationResult.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')}`,
      );
    }
    this.meta = validationResult.data; // Сохраняем валидированное значение
  }
}
