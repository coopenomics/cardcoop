/**
 * Интерфейс репозитория пользователей.
 *
 * Определяет методы для работы с хранилищем пользователей.
 * Конкретные реализации интерфейса находятся в слое инфраструктуры,
 * что позволяет доменному слою не зависеть от деталей хранения данных.
 */
import type { User } from '../entities/user.entity';

export interface UserRepository {
  /**
   * Создает нового пользователя в хранилище.
   *
   * @param user - Данные пользователя
   * @returns Созданный пользователь с заполненными полями
   */
  create(user: Partial<User>): Promise<User>;

  /**
   * Ищет пользователя по email.
   *
   * @param email - Email пользователя
   * @returns Найденный пользователь или null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Ищет пользователя по идентификатору.
   *
   * @param id - Идентификатор пользователя
   * @returns Найденный пользователь или null
   */
  findById(id: string): Promise<User | null>;

  /**
   * Обновляет данные пользователя.
   *
   * @param user - Данные пользователя для обновления
   * @returns Обновленный пользователь
   */
  update(user: User): Promise<User>;
}

/**
 * Символ-токен для инъекции конкретной реализации репозитория.
 * Используется для разрешения зависимостей в NestJS.
 */
export const USER_REPOSITORY = Symbol('UserRepository');
