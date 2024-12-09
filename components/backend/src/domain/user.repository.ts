import { User } from './user.entity';

export interface UserRepository {
  create(user: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  update(user: User): Promise<User>;
}

export const USER_REPOSITORY = Symbol('UserRepository')