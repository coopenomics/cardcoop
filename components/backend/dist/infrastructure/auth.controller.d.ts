import { AuthService } from '../application/auth.service';
import { InitiateRegistrationDto, CompleteRegistrationDto, UserResponseDto, InitiateLoginDto, CompleteLoginDto } from './dto/user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refreshAccessToken(authHeader: string): Promise<UserResponseDto>;
    logout(authHeader: string): Promise<void>;
}
