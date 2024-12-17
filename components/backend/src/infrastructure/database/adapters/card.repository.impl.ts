import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from '../../../domain/entities/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from '../../../domain/repositories/card.repository';

@Injectable()
export class CardRepositoryImpl implements CardRepository {
  constructor(
    @InjectRepository(Card)
    private readonly repository: Repository<Card>,
  ) {}

  async save(card: Partial<Card>): Promise<Card> {
    return this.repository.save(card);
  }

  async findByUsername(username: string): Promise<Card | null> {
    if (!username) {
      throw new BadRequestException('Username must be provided');
    }
    return this.repository.findOne({ where: { username } });
  }
  async findByUsernameAndUserId(username: string, userId: string): Promise<Card | null> {
    if (!username || userId) {
      throw new BadRequestException('Username and userId must be provided');
    }
    
    return this.repository.findOne({ where: { username, userId } });
  }
  
}
