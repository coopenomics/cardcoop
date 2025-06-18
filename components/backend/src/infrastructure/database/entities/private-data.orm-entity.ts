import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { PrivateDataMetaInterface } from '../../../domain/interfaces/private-data-meta.interface';

/**
 * ORM-сущность приватных данных пользователя для хранения в БД
 */
@Entity('private_data')
export class PrivateDataORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column('text')
  encrypted_data!: string;

  @Column()
  data_hash!: string;

  // Сохраняем meta как JSON-объект
  @Column('simple-json')
  meta!: PrivateDataMetaInterface;
}
