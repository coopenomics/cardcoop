import { UserDomainService } from '../domain/services/user.domain-service';
import { InitiateRegistrationDto, CompleteRegistrationDto, UserResponseDto, InitiateLoginDto, CompleteLoginDto } from '../infrastructure/dto/user.dto';
export declare class AuthService {
    private readonly userDomainService;
    constructor(userDomainService: UserDomainService);
    initiateRegistration(dto: InitiateRegistrationDto): Promise<{
        uuid: string;
        serverSalt: string;
    }>;
    completeRegistration(dto: CompleteRegistrationDto): Promise<UserResponseDto>;
    initiateLogin(dto: InitiateLoginDto): Promise<{
        uuid: string;
        serverSalt: string;
    }>;
    completeLogin(dto: CompleteLoginDto): Promise<UserResponseDto>;
    private generateAccessToken;
    private generateRefreshToken;
    refreshAccessToken(refreshToken: string): Promise<UserResponseDto>;
    logout(refreshToken: string): Promise<void>;
}
