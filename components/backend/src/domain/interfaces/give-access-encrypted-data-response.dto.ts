import type { AccessMetaDomainInterface } from "./access-meta.interface";

export interface GiveAccessEncryptedDataReponseDomainInterface {
  encrypted_data: string,
  coopname: string,
  username: string,
  public_key: string,
  meta: AccessMetaDomainInterface,
}