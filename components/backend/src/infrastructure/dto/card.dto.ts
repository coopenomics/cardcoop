import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IssueCardDto {
  @ApiProperty({
    description: 'Имя пользователя, которому будет выдана карта',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Зашифрованные данные, связанные с картой',
    example: 'encryptedData123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  encryptedData: string;

  @ApiProperty({
    description: 'Название кооператива',
    example: 'CoopNameXYZ',
  })
  @IsString()
  @IsNotEmpty()
  coopName: string;

  @ApiProperty({
    description: 'Цифровая подпись для проверки данных',
    example: 'signatureBase64Encoded12345',
  })
  @IsString()
  @IsNotEmpty()
  signature: string;
}


export class CardResponseDto {
  id: string;
  username: string;
  coopName: string;
}
