import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { AccessMetaDomainInterface } from '../../../domain/interfaces/access-meta.interface';

@Entity()
export class AccessRequestORM {
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
  
}
