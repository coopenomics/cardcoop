/**
 * Сервис для работы с блокчейном Antelope (EOS).
 *
 * Предоставляет интерфейс для взаимодействия с блокчейном, включая:
 * - Получение информации об аккаунтах
 * - Чтение данных из таблиц смарт-контрактов
 * - Взаимодействие с API блокчейна
 *
 * Сервис абстрагирует низкоуровневое взаимодействие с блокчейном,
 * предоставляя удобный интерфейс для других компонентов системы.
 */
import { BadRequestException, Injectable } from '@nestjs/common';
import { APIClient } from '@wharfkit/antelope';
import { Table } from '@wharfkit/contract';
import type {
  BlockchainAccountInterface,
  IndexPosition,
} from './blockchain.types';
import { PublicKey } from '@wharfkit/antelope';
import { ConfigService } from '../config/config.service';

@Injectable()
export class BlockchainService {
  private readonly apiClient: APIClient;

  constructor(private readonly config: ConfigService) {
    this.apiClient = new APIClient({ url: this.config.chainRpc });
  }

  /**
   * Получает публичный ключ аккаунта в блокчейне.
   *
   * Извлекает публичный ключ активного разрешения (active permission)
   * указанного аккаунта в блокчейне.
   *
   * @param username - Имя аккаунта в блокчейне
   * @returns Публичный ключ в строковом формате
   * @throws BadRequestException - если аккаунт не найден или публичный ключ не установлен
   */
  public async getAccountPublicKey(username: string): Promise<string> {
    const account = await this.getBlockchainAccount(username);

    if (!account) {
      throw new BadRequestException('Аккаунт не найден');
    }

    const permission = account.permissions.find(
      (el) => el.perm_name === 'active',
    );
    const key = permission?.required_auth?.keys[0]?.key;

    if (!key)
      throw new BadRequestException('Публичный ключ доступа не установлен');

    return PublicKey.from(key).toLegacyString();
  }

  /**
   * Получает информацию об аккаунте в блокчейне.
   *
   * @param username - Имя аккаунта в блокчейне
   * @returns Объект с информацией об аккаунте или null, если аккаунт не найден
   */
  public async getBlockchainAccount(
    username: string,
  ): Promise<BlockchainAccountInterface | null> {
    try {
      const result = JSON.parse(
        JSON.stringify(await this.apiClient.v1.chain.get_account(username)),
      );
      return result;
    } catch (e) {
      return null;
    }
  }

  /**
   * Получает все строки из таблицы смарт-контракта.
   *
   * @param code - Имя аккаунта смарт-контракта
   * @param scope - Область данных в таблице
   * @param tableName - Имя таблицы
   * @returns Массив строк из таблицы
   * @throws Error - если ABI контракта не найден
   */
  public async getAllRows<T = any>(
    code: string,
    scope: string,
    tableName: string,
  ): Promise<any[]> {
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

  /**
   * Выполняет запрос к таблице смарт-контракта с фильтрацией.
   *
   * Позволяет получить строки из таблицы с применением различных фильтров,
   * таких как диапазон значений индекса или максимальное количество строк.
   *
   * @param code - Имя аккаунта смарт-контракта
   * @param scope - Область данных в таблице
   * @param tableName - Имя таблицы
   * @param options - Параметры запроса (индекс, диапазон, количество строк)
   * @returns Отфильтрованный массив строк из таблицы
   * @throws Error - если ABI контракта не найден
   */
  public async query<T = any>(
    code: string,
    scope: string,
    tableName: string,
    options: {
      indexPosition?: IndexPosition;
      from?: string | number;
      to?: string | number;
      maxRows?: number;
    } = { indexPosition: 'primary' },
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

  /**
   * Получает одну строку из таблицы смарт-контракта по первичному ключу.
   *
   * @param code - Имя аккаунта смарт-контракта
   * @param scope - Область данных в таблице
   * @param tableName - Имя таблицы
   * @param primaryKey - Первичный ключ строки
   * @param indexPosition - Позиция индекса для поиска (по умолчанию primary)
   * @returns Объект строки или null, если строка не найдена
   * @throws Error - если ABI контракта не найден
   */
  public async getSingleRow<T = any>(
    code: string,
    scope: string,
    tableName: string,
    primaryKey: string | number,
    indexPosition: IndexPosition = 'primary',
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
