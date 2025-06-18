import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { CardMetaDomainInterface } from '../../../domain/interfaces/card-meta.interface';
import { PrivateDataORM } from './private-data.orm-entity';

/**
 * ORM-сущность карты пайщика для хранения в БД
 * Связана с приватными данными через private_data_id
 */
@Entity('card')
export class CardORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column()
  private_data_id!: string;

  @Column()
  username!: string;

  @Column()
  coopname!: string;

  @Column()
  encrypted_key!: string;

  // Устанавливаем связь с приватными данными
  @ManyToOne(() => PrivateDataORM)
  @JoinColumn({ name: 'private_data_id' })
  privateData!: PrivateDataORM;

  // Сохраняем meta как JSON-объект
  @Column('simple-json')
  meta!: CardMetaDomainInterface;
}
