import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtTokenRepository } from 'src/domain/repositories/jwt-token.repository';
import { Repository, LessThan } from 'typeorm';
import { JwtTokenORM } from '../entities/jwt-token.entity';

@Injectable()
export class TypeormJwtTokenRepository implements JwtTokenRepository {
  constructor(
    @InjectRepository(JwtTokenORM)
    private readonly repo: Repository<JwtTokenORM>,
  ) {}

  async saveJwt(jwt: string, expires_at: Date): Promise<void> {
    // Сохраняем новый токен без проверки существования
    const token = this.repo.create({ jwt, expires_at });
    await this.repo.save(token);
  }

  async isJwtValid(jwt: string): Promise<boolean> {
    const token = await this.repo.findOne({ where: { jwt } });
    if (!token) return false;
    return token.expires_at > new Date();
  }

  async revokeJwt(jwt: string): Promise<void> {
    await this.repo.delete({ jwt });
  }

  async cleanupExpired(): Promise<void> {
    await this.repo.delete({ expires_at: LessThan(new Date()) });
  }
}
