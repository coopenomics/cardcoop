import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('uuid_tokens')
export class UuidTokenORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'text', unique: true })
  value!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;
}
