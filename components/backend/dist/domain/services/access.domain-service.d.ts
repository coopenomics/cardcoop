import { AccessRequestRepository } from '../access-request.repository';
import { AccessRequest } from '../access-request.entity';
export declare class AccessDomainService {
    private readonly accessRequestRepository;
    constructor(accessRequestRepository: AccessRequestRepository);
    saveEncryptedData(accessRequest: AccessRequest): Promise<string>;
    getAccessRequestByAccessId(accessId: string): Promise<AccessRequest | undefined>;
    getEncryptedData(username: string, coopName: string): Promise<AccessRequest>;
    revokeAccess(username: string, coopName: string): Promise<void>;
    listAccesses(username: string): Promise<AccessRequest[]>;
}
