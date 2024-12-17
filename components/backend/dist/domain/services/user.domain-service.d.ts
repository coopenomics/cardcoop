import { UserRepository } from '../repositories/user.repository';
import type { InitiateRegistrationDomainReposponseInterface } from '../interfaces/initiate-registration-domain.interface';
import type { InitiateLoginDomainReposponseInterface } from '../interfaces/initiate-login-domain.interface';
import type { CompleteLoginResponseDomainInterface } from '../interfaces/compete-login-domain.interface';
export declare class UserDomainService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    initiateRegistration(email: string): Promise<InitiateRegistrationDomainReposponseInterface>;
    completeRegistration(email: string, hash_key: string, uuid: string, salt: string): Promise<CompleteLoginResponseDomainInterface>;
    initiateLogin(email: string): Promise<InitiateLoginDomainReposponseInterface>;
    completeLogin(email: string, hash_key: string, uuid: string): Promise<CompleteLoginResponseDomainInterface>;
    private generateAccessToken;
    private generateRefreshToken;
    refreshAccessToken(refreshToken: string): Promise<CompleteLoginResponseDomainInterface>;
}
