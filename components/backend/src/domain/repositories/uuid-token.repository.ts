export interface UuidTokenRepository {
  saveUuid(value: string, expiresAt: Date): Promise<void>;
  isUuidValid(value: string): Promise<boolean>;
  revokeUuid(value: string): Promise<void>;
  cleanupExpired(): Promise<void>;
}

export const UUID_TOKEN_REPOSITORY = Symbol('UUID_TOKEN_REPOSITORY');
