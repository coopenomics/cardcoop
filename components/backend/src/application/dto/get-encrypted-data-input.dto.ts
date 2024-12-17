import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetEncryptedDataInputDTO {
  @ApiProperty({ description: 'Имя пользователя', example: 'username' })
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Имя кооператива', example: 'voskhod' })
  @IsString()
  coopname!: string;
}