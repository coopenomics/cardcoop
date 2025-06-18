import { BadRequestException } from '@nestjs/common';
import type { CardMetaDomainInterface } from '../interfaces/card-meta.interface';
import { CardMetaSchema } from '../schemas/card-meta.schema';

/**
 * Сущность карты пайщика
 * Карта содержит ссылку на приватные данные пользователя
 * и зашифрованный ключ для доступа к определенному кооперативу
 */
export class Card {
  id!: string;
  user_id!: string; // ID пользователя-владельца карты
  private_data_id!: string; // ID связанных приватных данных
  username!: string; // Имя пользователя в кооперативе
  coopname!: string; // Название кооператива
  encrypted_key!: string; // Зашифрованный ключ доступа к кооперативу
  meta!: CardMetaDomainInterface; // Метаданные карты

  constructor(data: Card) {
    Object.assign(this, data);

    const validationResult = CardMetaSchema.safeParse(data.meta);
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
