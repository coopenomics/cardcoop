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

@Injectable()
export class AccessService {
  constructor(
    private readonly accessInteractor: AccessInteractor,
  ) {}

  async prepareShareData(dto: PrepareShareDataInputDTO): Promise<CoopInfoResponseDTO> {
    const result = await this.accessInteractor.prepareShareData(dto.coopname)
    return new CoopInfoResponseDTO(result)
  }

  async shareData(userId: string, dto: ShareDataDTO): Promise<ShareDataResponseDTO> {
    const ticket = await this.accessInteractor.shareData(userId, dto);
    return new ShareDataResponseDTO(ticket);
  }

  async exchangeTicketForJwt(dto: ExchangeTicketInputDTO): Promise<ExchangeTicketResponseDTO> {
    const access_token = await this.accessInteractor.exchangeTicketForJwt(dto);
    return new ExchangeTicketResponseDTO({access_token});
  }

  async getEncryptedData(params: GetEncryptedDataInputDTO): Promise<EncryptedDataResponseDTO> {
    const data = await this.accessInteractor.getEncryptedData(params.username, params.coopname);
    return new EncryptedDataResponseDTO(data);
  }
}
