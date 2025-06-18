import { config as dotenvConfig } from 'dotenv';
import { z } from 'zod';

// Грузим .env из process.cwd()
dotenvConfig();

const envSchema = z.object({
  // JWT
  JWT_SECRET: z.string().nonempty(),
  UUID_REG_EXPIRATION_MS: z
    .string()
    .default('10000')
    .transform((val) => parseInt(val, 10)),
  UUID_LOGIN_EXPIRATION_MS: z
    .string()
    .default('10000')
    .transform((val) => parseInt(val, 10)),
  ACCESS_TOKEN_EXPIRATION_DAYS: z
    .string()
    .default('30')
    .transform((val) => parseInt(val, 10)),
  REFRESH_TOKEN_EXPIRATION_DAYS: z
    .string()
    .default('180')
    .transform((val) => parseInt(val, 10)),

  // Redis
  // REDIS_HOST: z.string().default('127.0.0.1'),
  // REDIS_PORT: z
  //   .string()
  //   .default('6379')
  //   .transform((val) => parseInt(val, 10)),
  // REDIS_PASSWORD: z.string().default(''),

  // Database
  DB_TYPE: z.string().default('postgres'),
  POSTGRES_HOST: z.string().default('127.0.0.1'),
  POSTGRES_PORT: z
    .string()
    .default('5432')
    .transform((val) => parseInt(val, 10)),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_PASSWORD: z.string().default('postgres'),
  POSTGRES_DB: z.string().default('cardcoop'),

  // Chain
  CHAIN_RPC: z.string(),
  CHAIN_ID: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation error:', parsed.error.format());
  process.exit(1);
}

export const envVars = parsed.data;
