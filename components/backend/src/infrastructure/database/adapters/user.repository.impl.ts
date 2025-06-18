/**
 * Реализация репозитория пользователей с использованием TypeORM.
 *
 * Реализация интерфейса UserRepository из доменного слоя,
 * использующая TypeORM для взаимодействия с базой данных.
 * Отвечает за конвертацию между доменными сущностями и ORM-сущностями.
 */
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

  /**
   * Создает нового пользователя в БД.
   *
   * @param user - Данные пользователя
   * @returns Доменная сущность созданного пользователя
   */
  async create(user: Partial<User>): Promise<User> {
    const result = await this.repository.save(user);
    return new User(result);
  }

  /**
   * Ищет пользователя по email в БД.
   *
   * @param email - Email для поиска
   * @returns Доменная сущность найденного пользователя или null
   */
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOne({ where: { email } });
    if (result) {
      return new User(result);
    } else {
      return null;
    }
  }

  /**
   * Ищет пользователя по ID в БД.
   *
   * @param id - ID для поиска
   * @returns Доменная сущность найденного пользователя или null
   */
  async findById(id: string): Promise<User | null> {
    const result = await this.repository.findOne({ where: { id } });
    if (result) {
      return new User(result);
    } else {
      return null;
    }
  }

  /**
   * Обновляет данные пользователя в БД.
   *
   * @param user - Данные для обновления
   * @returns Доменная сущность обновленного пользователя
   */
  async update(user: User): Promise<User> {
    const result = await this.repository.save(user);
    return new User(result);
  }
}
