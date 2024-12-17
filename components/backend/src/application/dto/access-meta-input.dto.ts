import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import type { AccessMetaDomainInterface } from 'src/domain/interfaces/access-meta.interface';

export class AccessMetaInputDTO {
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
}
