import { Token } from 'src/domain/entities/token.entity';
import type { TokenRepository } from 'src/domain/repositories/token.repository';
import type { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenRepositoryImpl implements TokenRepository {
  constructor(
    @InjectRepository(Token)
    private readonly repository: Repository<Token>,
  ) {}

  async create(Token: Token): Promise<Token> {
    return this.repository.save(Token);
  }

  async findByTicket(ticket: string): Promise<Token | null> {
    return this.repository.findOne({ where: { ticket } });
  }

  async deleteByTicket(ticket: string): Promise<void> {
    await this.repository.delete({ ticket });
  }
}
