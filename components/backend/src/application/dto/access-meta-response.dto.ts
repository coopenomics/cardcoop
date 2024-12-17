import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

// DTO для метаданных AccessMeta
export class AccessMetaResponseDTO {
  @ApiProperty({
    description: 'Версия карты',
    example: 1,
  })
  @IsNumber()
  version!: number;

  @ApiProperty({
    description: 'Дата выпуска карты',
    example: '2024-12-16T10:00:00Z',
  })
  @IsDate()
  issued_at!: Date;

  @ApiProperty({
    description: 'Идентификатор устройства пользователя',
    example: 'device12345',
    required: false,
  })
  @IsString()
  @IsOptional()
  device_id?: string;

  @ApiProperty({
    description: 'Тип устройства пользователя',
    example: 'desktop',
    required: false,
  })
  @IsString()
  @IsOptional()
  device_type?: string;

  @ApiProperty({
    description: 'Операционная система устройства',
    example: 'Windows 10',
    required: false,
  })
  @IsString()
  @IsOptional()
  operating_system?: string;

  @ApiProperty({
    description: 'Браузер, через который был предоставлен доступ',
    example: 'Chrome 114',
    required: false,
  })
  @IsString()
  @IsOptional()
  browser?: string;

  @ApiProperty({
    description: 'Дата запроса',
    example: '2024-12-16T10:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  requested_at?: Date;
}
