import type { Token } from "../entities/token.entity";

export interface TokenRepository {
  create(token: Token): Promise<Token>;
  findByTicket(tokenId: string): Promise<Token | null>;
  deleteByTicket(tokenId: string): Promise<void>;
}

export const TOKEN_REPOSITORY = Symbol('TokenRepository')