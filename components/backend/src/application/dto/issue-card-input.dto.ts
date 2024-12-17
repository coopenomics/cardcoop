import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { CardMetaDTO } from './card-meta.dto';


export class IssueCardInputDTO {
  @ApiProperty({
    description: 'Имя пользователя, которому будет выдана карта',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'Зашифрованный приватный ключ',
    example: 'encryptedKey123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  encrypted_key!: string;

  @ApiProperty({
    description: 'Зашифрованные данные, связанные с картой',
    example: 'encryptedData123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  encrypted_data!: string;
  
  @ApiProperty({
    description: 'Метаданные, связанные с картой',
    example: {
      version: 1,
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => CardMetaDTO) // Используем вложенный класс
  meta!: CardMetaDTO;
}
