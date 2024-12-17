import { User } from '../entities/user.entity';

export interface UserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol('UserRepository')