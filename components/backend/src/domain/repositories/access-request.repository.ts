import type { AccessRequestORM } from "src/infrastructure/database/entities/access-request.orm-entity";

export interface AccessRequestRepository {
  save(request: Partial<AccessRequestORM>): Promise<AccessRequestORM>;
  findByTicket(ticket: string): Promise<AccessRequestORM | null>;
  findByUsernameAndCoopName(username: string, coopname: string): Promise<AccessRequestORM | null>;
  deleteByUsernameAndCoopName(username: string, coopname: string): Promise<void>;
  findByUsername(username: string): Promise<AccessRequestORM[]>;
}

export const ACCESS_REQUEST_REPOSITORY = Symbol('AccessRequestRepository')