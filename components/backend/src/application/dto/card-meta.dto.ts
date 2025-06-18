import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO для метаданных карты
 */
export class CardMetaDTO {
  @ApiProperty({
    description: 'Версия модели данных карты',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  version!: number;

  @ApiProperty({
    description: 'Тип карты',
    example: 'standard',
    required: false,
  })
  @IsString()
  @IsOptional()
  card_type?: string;

  @ApiProperty({
    description: 'Дата окончания действия карты',
    example: '2030-01-01',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  valid_until?: Date;

  @ApiProperty({
    description: 'Активна ли карта',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean = true;
}
