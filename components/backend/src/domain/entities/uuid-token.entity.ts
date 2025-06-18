export class UuidToken {
  id!: string;
  value!: string;
  expires_at!: Date;

  constructor(data: UuidToken) {
    Object.assign(this, data);
  }
}