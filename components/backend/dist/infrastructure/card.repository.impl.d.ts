import { Repository } from 'typeorm';
import { Card } from '../domain/card.entity';
import { CardRepository } from '../domain/card.repository';
export declare class CardRepositoryImpl implements CardRepository {
    private readonly repository;
    constructor(repository: Repository<Card>);
    save(card: Partial<Card>): Promise<Card>;
    findByUsername(username: string): Promise<Card | undefined>;
}
