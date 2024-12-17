import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import type { CoopInfoResponseDTO } from './coop-info-response.dto';
import { Type } from 'class-transformer';
import { AccessMetaInputDTO } from './access-meta-input.dto';


export class ShareDataDTO {
  @ApiProperty({
    description: 'Имя аккаунта пользователя',
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'Имя аккаунта кооператива',
    example: 'voskhod',
  })
  @IsString()
  @IsNotEmpty()
  coopname!: string;

  @ApiProperty({
    description: 'Зашифрованные данные для передачи',
    example: 'encryptedData123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  encrypted_data!: string;
  
  @ApiProperty({
    description: 'Публичный ключ кооператива необходимый для дешифровки',
    example: 'EOSPublicKey123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  public_key!: string;
  
  @ApiProperty({
    description: 'Не обязательные данные для идентификации устройства пользователя',
    type: AccessMetaInputDTO,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccessMetaInputDTO) // Указывает класс для вложенного объекта
  meta?: AccessMetaInputDTO;
  
  constructor(data: CoopInfoResponseDTO) {
    Object.assign(this, data);
  }
}
