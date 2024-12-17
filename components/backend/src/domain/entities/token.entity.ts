import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ticket!: string; // Уникальный идентификатор тикета

  @Column()
  username!: string;

  @Column({ default: false })
  isUsed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
  
  constructor(data: Token) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
