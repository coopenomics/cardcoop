import { BadRequestException } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AccessMetaSchema } from '../schemas/access-meta.schema';
import type { AccessMetaDomainInterface } from '../interfaces/access-meta.interface';

@Entity()
export class AccessRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  ticket!: string; 

  @Column()
  username!: string;

  @Column()
  coopname!: string;

  @Column()
  encrypted_data!: string;
  
  @Column()
  public_key!: string;
  
  @Column({default: false})
  ticket_is_used!: boolean;
  
  @Column('simple-json') // Поле `meta` хранится как JSON
  meta!: AccessMetaDomainInterface;
  
  constructor(data: AccessRequest) {
    if (data) {
      Object.assign(this, data);
      
      // Валидация meta через Zod
      const validationResult = AccessMetaSchema.safeParse(data.meta);
      if (!validationResult.success) {
        throw new BadRequestException(
          `Invalid meta: ${validationResult.error.errors
            .map((err) => `${err.path.join('.')}: ${err.message}`)
            .join(', ')}`,
        );
      }
      this.meta = validationResult.data; // Сохраняем валидированное значение
    }
  }
}
