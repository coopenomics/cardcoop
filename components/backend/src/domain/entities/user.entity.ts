export class User {
  id!: string;
  email!: string;
  salt!: string;
  hash_key!: string;

  constructor(data: User) {
    Object.assign(this,data)
  }
}