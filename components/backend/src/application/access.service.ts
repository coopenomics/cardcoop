import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AccessDomainService } from '../domain/services/access.domain-service';
import { PrepareShareDataDto, CoopInfoResponseDto, ShareDataDto, ShareDataResponseDto, CoopExchangeTicketDto, CoopJwtResponseDto } from '../infrastructure/dto/access.dto';
import { AccessRequest } from '../domain/access-request.entity';
import { COOP_REPOSITORY, CoopRepository } from 'src/domain/coop.repository';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AccessService {
  constructor(
    private readonly accessDomainService: AccessDomainService,
    @Inject(COOP_REPOSITORY) private readonly coopRepository: CoopRepository, // Репозиторий для получения информации о кооперативах
  ) {}

  async prepareShareData(dto: PrepareShareDataDto): Promise<CoopInfoResponseDto> {
    const coop = await this.coopRepository.findByName(dto.coopName);
    if (!coop) {
      throw new BadRequestException('Cooperative not found');
    }

    return {
      coopName: coop.name,
      coopPublicKey: coop.publicKey,
    };
  }

  async shareData(dto: ShareDataDto, username: string): Promise<ShareDataResponseDto> {
    const accessRequest = new AccessRequest();
    accessRequest.username = username;
    accessRequest.coopName = dto.coopName;
    accessRequest.encryptedData = dto.encryptedData;

    const ticket = await this.accessDomainService.saveEncryptedData(accessRequest);

    return { ticket };
  }

  async exchangeTicketForJwt(dto: CoopExchangeTicketDto): Promise<CoopJwtResponseDto> {
    const accessRequest = await this.accessDomainService.getAccessRequestByAccessId(dto.ticket);
    if (!accessRequest) {
      throw new BadRequestException('Invalid ticket');
    }

    // Генерируем JWT для кооператива с ограниченным доступом
    const coopAccessToken = jwt.sign(
      { username: accessRequest.username, coopName: accessRequest.coopName },
      'coop_access_secret',
      { expiresIn: '15m' },
    );

    return { accessToken: coopAccessToken };
  }

  async getEncryptedData(username: string, coopName: string): Promise<string> {
    const accessRequest = await this.accessDomainService.getEncryptedData(username, coopName);
    if (!accessRequest) {
      throw new BadRequestException('Access not granted');
    }
    return accessRequest.encryptedData;
  }

  // Методы для revokeAccess и listAccesses остаются без изменений
}
