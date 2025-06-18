import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { UuidTokenRepository } from 'src/domain/repositories/uuid-token.repository';
import { UuidTokenORM } from 'src/infrastructure/database/entities/uuid-token.entity';

@Injectable()
export class TypeormUuidTokenRepository implements UuidTokenRepository {
  constructor(
    @InjectRepository(UuidTokenORM)
    private readonly repo: Repository<UuidTokenORM>
  ) {}

  async saveUuid(value: string, expires_at: Date): Promise<void> {
    const token = this.repo.create({ value, expires_at });
    await this.repo.save(token);
  }

  async isUuidValid(value: string): Promise<boolean> {
    const token = await this.repo.findOne({ where: { value } });
    if (!token) return false;
    return token.expires_at > new Date();
  }

  async revokeUuid(value: string): Promise<void> {
    await this.repo.delete({ value });
  }

  async cleanupExpired(): Promise<void> {
    await this.repo.delete({ expires_at: LessThan(new Date()) });
  }
}
