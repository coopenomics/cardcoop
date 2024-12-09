import { Injectable } from '@nestjs/common';
import { UserDomainService } from '../domain/services/user.domain-service';
import { InitiateRegistrationDto, CompleteRegistrationDto, UserResponseDto, InitiateLoginDto, CompleteLoginDto } from '../infrastructure/dto/user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userDomainService: UserDomainService) {}

  async initiateRegistration(dto: InitiateRegistrationDto): Promise<{ uuid: string; serverSalt: string }> {
    return this.userDomainService.initiateRegistration(dto.email);
  }

  async completeRegistration(dto: CompleteRegistrationDto): Promise<UserResponseDto> {
    const user = await this.userDomainService.completeRegistration(dto.email, dto.hashKey, dto.uuid);

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async initiateLogin(dto: InitiateLoginDto): Promise<{ uuid: string; serverSalt: string }> {
    return this.userDomainService.initiateLogin(dto.email);
  }

  async completeLogin(dto: CompleteLoginDto): Promise<UserResponseDto> {
    const user = await this.userDomainService.completeLogin(dto.email, dto.hashKey, dto.uuid);

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string): string {
    return jwt.sign({ sub: userId }, 'access_secret', { expiresIn: '15m' });
  }

  private generateRefreshToken(userId: string): string {
    return jwt.sign({ sub: userId }, 'refresh_secret', { expiresIn: '7d' });
  }
  
  async refreshAccessToken(refreshToken: string): Promise<UserResponseDto> {
    try {
      const payload = jwt.verify(refreshToken, 'refresh_secret') as any;
      const userId = payload.sub;

      const accessToken = this.generateAccessToken(userId);
      const newRefreshToken = this.generateRefreshToken(userId);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    // В простейшем случае можно просто не принимать больше этот refreshToken
    // Для этого необходимо хранить список отозванных токенов или использовать JWT с коротким сроком жизни
  }
}
