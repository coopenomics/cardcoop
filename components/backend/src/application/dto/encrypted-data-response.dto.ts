import { ApiProperty } from '@nestjs/swagger';
import type { GiveAccessEncryptedDataReponseDomainInterface } from 'src/domain/interfaces/give-access-encrypted-data-response.dto';
import type { AccessMetaResponseDTO } from './access-meta-response.dto';

export class EncryptedDataResponseDTO {
  @ApiProperty({
    description: 'Зашифрованные данные',
    example: 'encrypted_string_example',
  })
  encrypted_data: string;

  @ApiProperty({
    description: 'Имя кооператива',
    example: 'voskhod',
  })
  coopname: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'user123',
  })
  username: string;

  @ApiProperty({
    description: 'Публичный ключ',
    example: 'public_key_example',
  })
  public_key: string;

  @ApiProperty({
    description: 'Метаданные доступа',
  })
  meta: AccessMetaResponseDTO;

  constructor(data: GiveAccessEncryptedDataReponseDomainInterface) {
    this.encrypted_data = data.encrypted_data;
    this.coopname = data.coopname;
    this.username = data.username;
    this.public_key = data.public_key;
    this.meta = data.meta;
  }
}
