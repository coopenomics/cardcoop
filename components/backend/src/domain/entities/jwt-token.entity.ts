export class JwtToken {
  id!: string;
  jwt!: string;
  expires_at!: Date;

  constructor(data: JwtToken) {
    Object.assign(this, data);
  }
}