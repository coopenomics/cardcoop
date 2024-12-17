import { Coop } from '../entities/coop.entity';

export interface CoopRepository {
  findByName(name: string): Promise<Coop | null>;
}

export const COOP_REPOSITORY = Symbol('CoopRepository')