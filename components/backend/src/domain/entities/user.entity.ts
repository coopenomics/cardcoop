import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  salt!: string;

  @Column()
  hash_key!: string;
  
  constructor(data: User) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
