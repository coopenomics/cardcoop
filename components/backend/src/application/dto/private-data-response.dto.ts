import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

/**
 * DTO для ответа при получении приватных данных
 */
export class PrivateDataResponseDTO {
  @ApiProperty({
    description: 'Зашифрованные данные пользователя',
    example: 'encrypted-data-string',
  })
  @IsString()
  encrypted_data!: string;

  @ApiProperty({
    description: 'Хеш данных для верификации',
    example: 'data-hash-string',
  })
  @IsString()
  data_hash!: string;

  @ApiProperty({
    description: 'Версия формата данных',
    example: 1,
  })
  @IsNumber()
  version!: number;

  @ApiProperty({
    description: 'Тип приватных данных',
    example: 'personal',
  })
  @IsString()
  data_type!: string;
}
