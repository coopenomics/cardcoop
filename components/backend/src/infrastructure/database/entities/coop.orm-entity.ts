import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CoopORM {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  coopname!: string;

  @Column()
  public_key!: string;
  
}
