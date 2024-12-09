import { Coop } from './coop.entity';
export interface CoopRepository {
    findByName(name: string): Promise<Coop | undefined>;
}
export declare const COOP_REPOSITORY: unique symbol;
