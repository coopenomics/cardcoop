import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Card } from '../domain/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from '../domain/card.repository';

@Injectable()
export class CardRepositoryImpl implements CardRepository {
  constructor(
    @InjectRepository(Card)
    private readonly repository: Repository<Card>,
  ) {}

  async save(card: Partial<Card>): Promise<Card> {
    return this.repository.save(card);
  }

  async findByUsername(username: string): Promise<Card | undefined> {
    return this.repository.findOne({ where: { username } });
  }
}
