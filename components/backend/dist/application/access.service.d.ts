import { AccessDomainService } from '../domain/services/access.domain-service';
import { PrepareShareDataDto, CoopInfoResponseDto, ShareDataDto, ShareDataResponseDto, CoopExchangeTicketDto, CoopJwtResponseDto } from '../infrastructure/dto/access.dto';
import { CoopRepository } from 'src/domain/coop.repository';
export declare class AccessService {
    private readonly accessDomainService;
    private readonly coopRepository;
    constructor(accessDomainService: AccessDomainService, coopRepository: CoopRepository);
    prepareShareData(dto: PrepareShareDataDto): Promise<CoopInfoResponseDto>;
    shareData(dto: ShareDataDto, username: string): Promise<ShareDataResponseDto>;
    exchangeTicketForJwt(dto: CoopExchangeTicketDto): Promise<CoopJwtResponseDto>;
    getEncryptedData(username: string, coopName: string): Promise<string>;
}
