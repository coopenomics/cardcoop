import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CardORM } from '../entities/card.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardRepository } from '../../../domain/repositories/card.repository';
import { Card } from 'src/domain/entities/card.entity';

/**
 * Реализация репозитория карт пайщика
 */
@Injectable()
export class CardRepositoryImpl implements CardRepository {
  constructor(
    @InjectRepository(CardORM)
    private readonly repository: Repository<CardORM>,
  ) {}

  /**
   * Сохраняет карту в БД
   * @param card Данные карты (частичные)
   * @returns Сохраненная карта
   */
  async save(card: Partial<Card>): Promise<Card> {
    return new Card(await this.repository.save(card));
  }

  /**
   * Ищет карту по ID
   * @param id ID карты
   * @returns Карта или null
   */
  async findById(id: string): Promise<Card | null> {
    if (!id) {
      throw new BadRequestException('ID must be provided');
    }
    const result = await this.repository.findOne({ where: { id } });
    return result ? new Card(result) : null;
  }

  /**
   * Ищет карту по имени пользователя и названию кооператива
   * @param username Имя пользователя
   * @param coopname Название кооператива
   * @returns Карта или null
   */
  async findByUsername(
    username: string,
    coopname: string,
  ): Promise<Card | null> {
    if (!username || !coopname) {
      throw new BadRequestException('Username and coopname must be provided');
    }
    const result = await this.repository.findOne({
      where: { username, coopname },
    });
    return result ? new Card(result) : null;
  }

  /**
   * Ищет все карты пользователя
   * @param user_id ID пользователя
   * @returns Массив карт
   */
  async findByUserId(user_id: string): Promise<Card[]> {
    if (!user_id) {
      throw new BadRequestException('User ID must be provided');
    }
    const cards = await this.repository.find({ where: { user_id } });
    return cards.map((card) => new Card(card));
  }

  /**
   * Ищет карту пользователя для конкретного кооператива
   * @param user_id ID пользователя
   * @param coopname Название кооператива
   * @returns Карта или null
   */
  async findByUserIdAndCoopName(
    user_id: string,
    coopname: string,
  ): Promise<Card | null> {
    if (!user_id || !coopname) {
      throw new BadRequestException('User ID and coopname must be provided');
    }
    const card = await this.repository.findOne({
      where: { user_id, coopname },
    });
    return card ? new Card(card) : null;
  }

  /**
   * Ищет все карты, связанные с конкретными приватными данными
   * @param private_data_id ID приватных данных
   * @returns Массив карт
   */
  async findByPrivateDataId(private_data_id: string): Promise<Card[]> {
    if (!private_data_id) {
      throw new BadRequestException('Private data ID must be provided');
    }
    const cards = await this.repository.find({ where: { private_data_id } });
    return cards.map((card) => new Card(card));
  }
}
