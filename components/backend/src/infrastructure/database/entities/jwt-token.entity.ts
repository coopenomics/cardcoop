import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('jwt_tokens')
export class JwtTokenORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'text', unique: true })
  jwt!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;
}
