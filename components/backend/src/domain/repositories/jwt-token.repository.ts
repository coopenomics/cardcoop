export interface JwtTokenRepository {
  saveJwt(jwt: string, expiresAt: Date): Promise<void>;
  isJwtValid(jwt: string): Promise<boolean>;
  revokeJwt(jwt: string): Promise<void>;
  cleanupExpired(): Promise<void>;
}

export const JWT_TOKEN_REPOSITORY = Symbol('JWT_TOKEN_REPOSITORY');
