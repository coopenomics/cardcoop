import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserORM } from '../entities/user.entity';
import { User } from 'src/domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserORM)
    private readonly repository: Repository<UserORM>,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const result = await this.repository.save(user);
    return new User(result)
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOne({ where: { email } });
    if (result)
      return new User(result)
    else return null
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.repository.findOne({ where: { id } });
    if (result)
      return new User(result)
    else return null
  }

  async update(user: User): Promise<User> {
    const result = await this.repository.save(user);
    return new User(result)
  }
}
