import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для карты в списке карт пользователя
 */
export class GetUserCardsResponseDTO {
  @ApiProperty({
    description: 'Уникальный идентификатор карты',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Имя пользователя в кооперативе',
    example: 'username123',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Имя аккаунта кооператива',
    example: 'coop_example',
  })
  @IsString()
  coopname!: string;

  @ApiProperty({
    description: 'Дата выпуска карты',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  issued_at!: Date;

  @ApiProperty({
    description: 'Тип карты',
    example: 'standard',
  })
  @IsString()
  card_type!: string;

  @ApiProperty({
    description: 'Активна ли карта',
    example: true,
  })
  @IsBoolean()
  is_active!: boolean;

  @ApiProperty({
    description: 'Зашифрованный ключ',
    example: 'encrypted_key_data_base64',
    required: true,
  })
  @IsString()
  encrypted_key!: string;
}
