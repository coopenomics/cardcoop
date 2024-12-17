import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY, UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import type { InitiateRegistrationDomainReposponseInterface } from '../interfaces/initiate-registration-domain.interface';
import type { InitiateLoginDomainReposponseInterface } from '../interfaces/initiate-login-domain.interface';
import type { CompleteLoginResponseDomainInterface } from '../interfaces/compete-login-domain.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserDomainService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async initiateRegistration(email: string): Promise<InitiateRegistrationDomainReposponseInterface> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = uuidv4();
    const uuid = uuidv4();

    // Можно сохранить временные данные, если необходимо

    return { uuid, salt };
  }

  async completeRegistration(email: string, hash_key: string, uuid: string, salt: string): Promise<CompleteLoginResponseDomainInterface> {
    const user = new User({
      id: uuidv4(),
      email, 
      salt,
      hash_key,
    });

    await this.userRepository.create(user);
    
    
    const access_token = this.generateAccessToken(user.id);
    const refresh_token = this.generateRefreshToken(user.id);

    return {access_token, refresh_token}
  }

  async initiateLogin(email: string): Promise<InitiateLoginDomainReposponseInterface> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return { uuid: uuidv4(), salt: user.salt };
  }

  async completeLogin(email: string, hash_key: string, uuid: string): Promise<CompleteLoginResponseDomainInterface> {
    //TODO check uuid here
    
    const user = await this.userRepository.findByEmail(email);
    
    if (!user || user.hash_key !== hash_key) {
      throw new Error('Invalid credentials');
    }
    
    const access_token = this.generateAccessToken(user.id);
    const refresh_token = this.generateRefreshToken(user.id);
    
    return {access_token, refresh_token};
  }
  
  
  private generateAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET as string, { expiresIn: '180d' });
  }
  
  async refreshAccessToken(refreshToken: string): Promise<CompleteLoginResponseDomainInterface> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as any;
      const userId = payload.sub;

      const access_token = this.generateAccessToken(userId);
      const newRefreshToken = this.generateRefreshToken(userId);

      return { access_token, refresh_token: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
