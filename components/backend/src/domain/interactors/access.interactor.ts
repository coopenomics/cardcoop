import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ACCESS_REQUEST_REPOSITORY, AccessRequestRepository } from '../repositories/access-request.repository';
import { AccessRequest } from '../entities/access-request.entity';
import { v4 as uuidv4, v4 } from 'uuid';
import { AccessDomainService } from '../services/access.domain-service';
import { COOP_REPOSITORY, CoopRepository } from '../repositories/coop.repository';
import type { ExchangeTicketResponseDTO } from 'src/application/dto/exchange-ticket-response.dto';
import type { ExchangeTicketInputDTO } from 'src/application/dto/exchange-ticket-input.dto';
import type { ShareDataResponseDTO } from 'src/application/dto/share-data-response.dto';
import type { ShareDataDTO } from 'src/application/dto/share-data-input.dto';
import type { CoopInfoResponseDTO } from 'src/application/dto/coop-info-response.dto';
import * as jwt from 'jsonwebtoken';
import { USER_REPOSITORY, UserRepository } from '../repositories/user.repository';
import { CARD_REPOSITORY, CardRepository } from '../repositories/card.repository';
import { BlockchainService } from 'src/infrastructure/blockchain/blockchain.service';
import type { PrepareShareDataDomainResultInterface } from '../interfaces/prepare-share-data-domain-result.interface';
import { RegistratorContract } from 'cooptypes';
import type { GiveAccessEncryptedDataReponseDomainInterface } from '../interfaces/give-access-encrypted-data-response.dto';

@Injectable()
export class AccessInteractor {
  constructor(
    private readonly accessDomainService: AccessDomainService,
    private readonly blockchainService: BlockchainService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository,
    @Inject(ACCESS_REQUEST_REPOSITORY) private readonly accessRepository: AccessRequestRepository,
    
  ) {}
  
  async prepareShareData(coopname: string): Promise<PrepareShareDataDomainResultInterface> {
    const public_key = await this.blockchainService.getAccountPublicKey(coopname);
    const publicData = await this.blockchainService.getSingleRow<RegistratorContract.Tables.Cooperatives.ICooperative>(RegistratorContract.contractName.production, RegistratorContract.contractName.production, RegistratorContract.Tables.Cooperatives.tableName, coopname)
    
    if (!publicData)
      throw new BadRequestException('Публичная информация о кооперативе не найдена');
    
    return {
      coopname, 
      public_key,
      announce: publicData.announce,
    }
  }
  
  async shareData(userId: string, dto: ShareDataDTO): Promise<string> {
    const card = await this.cardRepository.findByUsername(dto.username)
    
    if (!card)
      throw new BadRequestException('Карта не найдена');
    
    if (userId != card.userId)
      throw new BadRequestException('Нельзя воспользоваться чужой картой');
    
    const accessRequest = new AccessRequest({
      id: v4(),
      username: card.username, 
      coopname: dto.coopname, 
      encrypted_data: dto.encrypted_data, 
      meta: {
        issued_at: new Date(card.meta.issued_at),
        version: card.meta.version,
        requested_at: new Date(),
        ...dto.meta,
      },
      ticket: v4(),
      public_key: dto.public_key,
      ticket_is_used: false,      
    });
    
    const ticket = await this.accessDomainService.saveEncryptedCard(accessRequest);

    return ticket;
  }
  
  async exchangeTicketForJwt(dto: ExchangeTicketInputDTO): Promise<string> {
    const accessRequest = await this.accessDomainService.getAccessRequestByTicket(dto.ticket);
    
    if (!accessRequest || accessRequest.ticket_is_used) {
      throw new BadRequestException('Invalid ticket');
    }

    // Генерируем JWT для кооператива с ограниченным доступом
    const coopAccessToken = jwt.sign(
      { username: accessRequest.username, coopname: accessRequest.coopname },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' },
    );
    
    accessRequest.ticket_is_used = true
    
    await this.accessRepository.save(accessRequest)
    
    return coopAccessToken;
  }

  async getEncryptedData(username: string, coopname: string): Promise<GiveAccessEncryptedDataReponseDomainInterface> {
    const accessRequest = await this.accessDomainService.getAccessRequestByUsernameAndCoopname(username, coopname);
    
    return {
      coopname,
      username,
      encrypted_data: accessRequest.encrypted_data,
      meta: accessRequest.meta,
      public_key: accessRequest.public_key,
    };
  }

}