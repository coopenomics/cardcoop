import { Injectable } from '@nestjs/common';
import { envVars } from './env.validation';

@Injectable()
export class ConfigService {
  public readonly jwtSecret = envVars.JWT_SECRET;
  public readonly uuidRegExpirationMs = envVars.UUID_REG_EXPIRATION_MS;
  public readonly uuidLoginExpirationMs = envVars.UUID_LOGIN_EXPIRATION_MS;
  public readonly accessTokenExpirationDays =
    envVars.ACCESS_TOKEN_EXPIRATION_DAYS;
  public readonly refreshTokenExpirationDays =
    envVars.REFRESH_TOKEN_EXPIRATION_DAYS;

  // public readonly redisHost = envVars.REDIS_HOST;
  // public readonly redisPort = envVars.REDIS_PORT;
  // public readonly redisPassword = envVars.REDIS_PASSWORD;

  // Database
  public readonly dbType = envVars.DB_TYPE;
  public readonly dbHost = envVars.POSTGRES_HOST;
  public readonly dbPort = envVars.POSTGRES_PORT;
  public readonly dbUsername = envVars.POSTGRES_USER;
  public readonly dbPassword = envVars.POSTGRES_PASSWORD;
  public readonly dbDatabase = envVars.POSTGRES_DB;

  public readonly chainRpc = envVars.CHAIN_RPC;
  public readonly chainId = envVars.CHAIN_ID;
}
