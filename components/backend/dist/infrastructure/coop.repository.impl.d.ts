import { Repository } from 'typeorm';
import { Coop } from '../domain/coop.entity';
import { CoopRepository } from '../domain/coop.repository';
export declare class CoopRepositoryImpl implements CoopRepository {
    private readonly repository;
    constructor(repository: Repository<Coop>);
    findByName(name: string): Promise<Coop | undefined>;
}
