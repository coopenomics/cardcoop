import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Coop {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  coopname!: string;

  @Column()
  public_key!: string;
  
  constructor(data: Coop) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
