import { Coop } from './coop.entity';

export interface CoopRepository {
  findByName(name: string): Promise<Coop | undefined>;
}

export const COOP_REPOSITORY = Symbol('CoopRepository')