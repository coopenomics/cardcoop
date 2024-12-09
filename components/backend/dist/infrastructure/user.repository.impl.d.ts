import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';
export declare class UserRepositoryImpl implements UserRepository {
    private readonly repository;
    constructor(repository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    update(user: User): Promise<User>;
}
