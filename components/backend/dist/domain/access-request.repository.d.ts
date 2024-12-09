import { AccessRequest } from './access-request.entity';
export interface AccessRequestRepository {
    create(request: Partial<AccessRequest>): Promise<AccessRequest>;
    update(request: AccessRequest): Promise<AccessRequest>;
    findByAccessId(accessId: string): Promise<AccessRequest | undefined>;
    findByUsernameAndCoopName(username: string, coopName: string): Promise<AccessRequest | undefined>;
    deleteByUsernameAndCoopName(username: string, coopName: string): Promise<void>;
    findByUsername(username: string): Promise<AccessRequest[]>;
}
export declare const ACCESS_REQUEST_REPOSITORY: unique symbol;
