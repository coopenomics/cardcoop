import { AccessRequestRepository } from '../repositories/access-request.repository';
import { AccessRequest } from '../entities/access-request.entity';
export declare class AccessDomainService {
    private readonly accessRequestRepository;
    constructor(accessRequestRepository: AccessRequestRepository);
    saveEncryptedCard(accessRequest: AccessRequest): Promise<string>;
    getAccessRequestByTicket(ticket: string): Promise<AccessRequest | null>;
    getAccessRequestByUsernameAndCoopname(username: string, coopname: string): Promise<AccessRequest>;
    revokeAccess(username: string, coopname: string): Promise<void>;
    listAccesses(username: string): Promise<AccessRequest[]>;
}
