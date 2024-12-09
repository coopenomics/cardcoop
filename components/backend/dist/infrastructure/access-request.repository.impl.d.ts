import { Repository } from 'typeorm';
import { AccessRequest } from '../domain/access-request.entity';
import { AccessRequestRepository } from '../domain/access-request.repository';
export declare class AccessRequestRepositoryImpl implements AccessRequestRepository {
    private readonly repository;
    constructor(repository: Repository<AccessRequest>);
    create(request: AccessRequest): Promise<AccessRequest>;
    update(request: AccessRequest): Promise<AccessRequest>;
    findByAccessId(accessId: string): Promise<AccessRequest | undefined>;
    findByUsernameAndCoopName(username: string, coopName: string): Promise<AccessRequest | undefined>;
    deleteByUsernameAndCoopName(username: string, coopName: string): Promise<void>;
    findByUsername(username: string): Promise<AccessRequest[]>;
}
