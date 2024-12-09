import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../user.repository';
import { User } from '../user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserDomainService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async initiateRegistration(email: string): Promise<{ uuid: string; serverSalt: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const serverSalt = uuidv4();
    const uuid = uuidv4();

    // Можно сохранить временные данные, если необходимо

    return { uuid, serverSalt };
  }

  async completeRegistration(email: string, hashKey: string, uuid: string): Promise<User> {
    // Проверка временных данных, если необходимо

    const user = new User();
    user.email = email;
    user.serverSalt = uuid;
    user.hashKey = hashKey;

    return this.userRepository.create(user);
  }

  async initiateLogin(email: string): Promise<{ uuid: string; serverSalt: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return { uuid: user.serverSalt, serverSalt: user.serverSalt };
  }

  async completeLogin(email: string, hashKey: string, uuid: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.serverSalt !== uuid || user.hashKey !== hashKey) {
      throw new Error('Invalid credentials');
    }

    return user;
  }
}
