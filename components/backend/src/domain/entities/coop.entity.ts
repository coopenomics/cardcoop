export class Coop {
  id!: string;
  coopname!: string;
  public_key!: string;

  constructor(data: Coop) {
    Object.assign(this, data);
  }
}
