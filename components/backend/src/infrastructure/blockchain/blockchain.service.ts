// infrastructure/blockchain/blockchain.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { APIClient } from '@wharfkit/antelope';
import { Table } from '@wharfkit/contract';
import type { BlockchainAccountInterface, IndexPosition } from './blockchain.types';
import { PublicKey } from '@wharfkit/antelope';

@Injectable()
export class BlockchainService {
  private readonly apiClient: APIClient;
  
  constructor() {
    this.apiClient = new APIClient({ url: process.env.CHAIN_RPC });
  }
  
  public async getAccountPublicKey(username: string): Promise<string> {
    const account = await this.getBlockchainAccount(username)  
    
    if (!account) {
      throw new BadRequestException('Аккаунт не найден');
    }
    
    const permission = account.permissions.find(el => el.perm_name === 'active')
    const key = permission?.required_auth?.keys[0]?.key;
    
    if (!key)
      throw new BadRequestException('Публичный ключ доступна не установлен');
    
    return PublicKey.from(key).toLegacyString()
    
  }
  
  public async getBlockchainAccount(username: string): Promise<BlockchainAccountInterface | null> {
    try {
      const result = JSON.parse(JSON.stringify(await this.apiClient.v1.chain.get_account(username)));
      return result;
    } catch (e) {
      return null;
    }
  }

  public async getAllRows<T = any>(code: string, scope: string, tableName: string): Promise<any[]> {
    const { abi } = await this.apiClient.v1.chain.get_abi(code);
    if (!abi) throw new Error(`ABI контракта ${code} не найден`);

    const table = new Table({
      abi,
      account: code,
      name: tableName,
      client: this.apiClient,
    });

    const rows = await table.all({ scope });
    return JSON.parse(JSON.stringify(rows)) as T[];
  }

  public async query<T = any>(
    code: string,
    scope: string,
    tableName: string,
    options: {
      indexPosition?: IndexPosition;
      from?: string | number;
      to?: string | number;
      maxRows?: number;
    } = { indexPosition: 'primary' }
  ): Promise<T[]> {
    const { indexPosition = 'primary', from, to, maxRows } = options;

    const { abi } = await this.apiClient.v1.chain.get_abi(code);
    if (!abi) throw new Error(`ABI контракта ${code} не найден`);

    const table = new Table({
      abi,
      account: code,
      name: tableName,
      client: this.apiClient,
    });

    const rows = await table.query({
      scope,
      index_position: indexPosition,
      from,
      to,
      maxRows,
    });

    return JSON.parse(JSON.stringify(rows)) as T[];
  }

  public async getSingleRow<T = any>(
    code: string,
    scope: string,
    tableName: string,
    primaryKey: string | number,
    indexPosition: IndexPosition = 'primary'
  ): Promise<T | null> {
    const { abi } = await this.apiClient.v1.chain.get_abi(code);
    if (!abi) throw new Error(`ABI контракта ${code} не найден`);

    const table = new Table({
      abi,
      account: code,
      name: tableName,
      client: this.apiClient,
    });

    const row = await table.get(String(primaryKey), {
      scope,
      index_position: indexPosition,
    });

    return row ? (JSON.parse(JSON.stringify(row)) as T) : null;
  }
}
