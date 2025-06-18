import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDate } from 'class-validator';
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
    description: 'Название кооператива',
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
}
