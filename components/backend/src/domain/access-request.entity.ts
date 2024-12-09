import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AccessRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  accessId: string; // Уникальный идентификатор (ticket)

  @Column()
  username: string;

  @Column()
  coopName: string;

  @Column()
  encryptedData: string;
}
