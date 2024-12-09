import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  encryptedData: string;

  @Column()
  coopName: string;

  @Column()
  signature: string;

  @Column()
  userId: string;
}
