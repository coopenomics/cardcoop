import { BadRequestException } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CardMetaSchema } from '../schemas/card-meta.schema';
import type { CardMetaDomainInterface } from '../interfaces/card-meta.interface';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  username!: string;

  @Column()
  encrypted_key!: string;

  @Column()
  encrypted_data!: string;

  @Column()
  data_hash!: string;

  // Сохраняем meta как JSON-объект
  @Column('simple-json')
  meta!: CardMetaDomainInterface;

  constructor(data: Card) {
    if (data) {
      Object.assign(this, data);
      
      const validationResult = CardMetaSchema.safeParse(data.meta);
      if (!validationResult.success) {
        throw new BadRequestException(
          `Invalid meta: ${validationResult.error.message}`,
        );
      }
      this.meta = validationResult.data; // Сохраняем валидированное значение
    }
  }
}
