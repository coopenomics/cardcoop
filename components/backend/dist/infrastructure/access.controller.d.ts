import { AccessService } from '../application/access.service';
import { PrepareShareDataDto, CoopInfoResponseDto, ShareDataDto, ShareDataResponseDto, CoopExchangeTicketDto, CoopJwtResponseDto } from './dto/access.dto';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    prepareShareData(dto: PrepareShareDataDto): Promise<CoopInfoResponseDto>;
    shareData(dto: ShareDataDto, req: any): Promise<ShareDataResponseDto>;
    exchangeTicketForJwt(dto: CoopExchangeTicketDto): Promise<CoopJwtResponseDto>;
    getEncryptedData(username: string, coopName: string): Promise<{
        encryptedData: string;
    }>;
}
