import { Injectable } from '@nestjs/common';
import { CardInteractor } from 'src/domain/interactors/card.interactor';
import type { PrivateDataResponseDTO } from '../dto/private-data-response.dto';

/**
 * Сервис приложения для работы с персональными данными пользователя
 */
@Injectable()
export class PersonaService {
  constructor(private readonly cardInteractor: CardInteractor) {}

  /**
   * Получает приватные данные пользователя
   *
   * @param user_id ID пользователя
   * @returns Зашифрованные приватные данные
   */
  async getUserPrivateData(user_id: string): Promise<PrivateDataResponseDTO> {
    const privateData = await this.cardInteractor.getUserPrivateData(user_id);

    return {
      encrypted_data: privateData.encrypted_data,
      data_hash: privateData.data_hash,
      version: privateData.meta.version,
      data_type: privateData.meta.data_type,
    };
  }
}
