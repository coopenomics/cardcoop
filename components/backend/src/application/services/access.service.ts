import { Injectable } from '@nestjs/common';
import { ExchangeTicketResponseDTO } from '../dto/exchange-ticket-response.dto';
import { ExchangeTicketInputDTO } from '../dto/exchange-ticket-input.dto';
import { ShareDataResponseDTO } from '../dto/share-data-response.dto';
import { ShareDataDTO } from '../dto/share-data-input.dto';
import { CoopInfoResponseDTO } from '../dto/coop-info-response.dto';
import { PrepareShareDataInputDTO } from '../dto/prepare-share-data-input.DTO';
import { AccessInteractor } from 'src/domain/interactors/access.interactor';
import { GetEncryptedDataInputDTO } from '../dto/get-encrypted-data-input.dto';
import { EncryptedDataResponseDTO } from '../dto/encrypted-data-response.dto';
import { RevokeAccessInputDTO } from '../dto/revoke-access-input.dto';
import { AccessResponseDTO } from '../dto/access-response.dto';

@Injectable()
export class AccessService {
  constructor(private readonly accessInteractor: AccessInteractor) {}

  async prepareShareData(
    dto: PrepareShareDataInputDTO,
  ): Promise<CoopInfoResponseDTO> {
    const result = await this.accessInteractor.prepareShareData(dto.coopname);
    return new CoopInfoResponseDTO(result);
  }

  async shareData(
    user_id: string,
    dto: ShareDataDTO,
  ): Promise<ShareDataResponseDTO> {
    const ticket = await this.accessInteractor.shareData(user_id, dto);
    return new ShareDataResponseDTO(ticket);
  }

  async exchangeTicketForJwt(
    dto: ExchangeTicketInputDTO,
  ): Promise<ExchangeTicketResponseDTO> {
    const accessTokenObj =
      await this.accessInteractor.exchangeTicketForJwt(dto);
    return new ExchangeTicketResponseDTO(accessTokenObj);
  }

  async getEncryptedData(
    params: GetEncryptedDataInputDTO,
  ): Promise<EncryptedDataResponseDTO> {
    const data = await this.accessInteractor.getEncryptedData(
      params.username,
      params.coopname,
    );
    return new EncryptedDataResponseDTO(data);
  }

  /**
   * Отзыв доступа к данным карты у кооператива
   * @param user_id ID пользователя, отзывающего доступ
   * @param dto Данные для отзыва доступа
   */
  async revokeAccess(
    user_id: string,
    dto: RevokeAccessInputDTO,
  ): Promise<void> {
    // Проверка принадлежности карты пользователю может быть добавлена в интеракторе
    await this.accessInteractor.revokeAccess(
      user_id,
      dto.username,
      dto.coopname,
    );
  }

  /**
   * Получение списка доступов пользователя
   * @param user_id ID пользователя
   * @returns Список доступов пользователя
   */
  async listAccesses(user_id: string): Promise<AccessResponseDTO[]> {
    // Получаем все карты пользователя
    const userCards = await this.accessInteractor.getUserCards(user_id);

    if (!userCards || userCards.length === 0) {
      return [];
    }

    // Для каждой карты получаем список доступов и объединяем их
    const accessesByCard = await Promise.all(
      userCards.map((card) =>
        this.accessInteractor.listAccessesByUsername(card.username),
      ),
    );

    // Преобразуем в плоский массив и маппим в DTO
    return accessesByCard.flat().map((access) => new AccessResponseDTO(access));
  }
}
