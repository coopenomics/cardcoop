import { UserRepository } from '../user.repository';
import { User } from '../user.entity';
export declare class UserDomainService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    initiateRegistration(email: string): Promise<{
        uuid: string;
        serverSalt: string;
    }>;
    completeRegistration(email: string, hashKey: string, uuid: string): Promise<User>;
    initiateLogin(email: string): Promise<{
        uuid: string;
        serverSalt: string;
    }>;
    completeLogin(email: string, hashKey: string, uuid: string): Promise<User>;
}
