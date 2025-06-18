import { UserRepository } from '../repositories/user.repository';
import { JwtTokenRepository } from '../repositories/jwt-token.repository';
import { UuidTokenRepository } from '../repositories/uuid-token.repository';
import { ConfigService } from 'src/infrastructure/config/config.service';
import type { LogoutInputDomainInterface } from '../interfaces/logout-input.interface';
export declare class UserDomainService {
    private readonly config;
    private readonly userRepository;
    private readonly jwtTokenRepository;
    private readonly uuidTokenRepository;
    constructor(config: ConfigService, userRepository: UserRepository, jwtTokenRepository: JwtTokenRepository, uuidTokenRepository: UuidTokenRepository);
    initiateRegistration(email: string): Promise<{
        uuid: string;
        salt: string;
    }>;
    completeRegistration(email: string, hash_key: string, uuid: string, salt: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    initiateLogin(email: string): Promise<{
        uuid: string;
        salt: string;
    }>;
    completeLogin(email: string, hash_key: string, uuid: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(data: LogoutInputDomainInterface): Promise<void>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    revokeJwt(jwtToken: string): Promise<void>;
    revokeUuid(uuid: string): Promise<void>;
    private generateAccessToken;
    private generateRefreshToken;
    private datePlusDays;
}
