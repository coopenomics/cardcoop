import { AccessRequest } from '../entities/access-request.entity';

export interface AccessRequestRepository {
  save(request: Partial<AccessRequest>): Promise<AccessRequest>;
  findByTicket(ticket: string): Promise<AccessRequest | null>;
  findByUsernameAndCoopName(username: string, coopname: string): Promise<AccessRequest | null>;
  deleteByUsernameAndCoopName(username: string, coopname: string): Promise<void>;
  findByUsername(username: string): Promise<AccessRequest[]>;
}

export const ACCESS_REQUEST_REPOSITORY = Symbol('AccessRequestRepository')