import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AccessRequest } from 'src/domain/entities/access-request.entity';

/**
 * DTO для представления информации о предоставленном доступе к данным
 */
export class AccessResponseDTO {
  @ApiProperty({
    description: 'Уникальный идентификатор доступа',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Имя пользователя, чьи данные доступны',
    example: 'username123',
  })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Название кооператива, которому предоставлен доступ',
    example: 'coop_example',
  })
  @IsString()
  coopname!: string;

  @ApiProperty({
    description: 'Дата предоставления доступа',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  granted_at!: Date;

  @ApiProperty({
    description: 'Активен ли доступ',
    example: true,
  })
  @IsBoolean()
  is_active!: boolean;

  /**
   * Создает экземпляр DTO из сущности запроса доступа
   * @param accessRequest Сущность запроса доступа
   */
  constructor(accessRequest?: AccessRequest) {
    if (accessRequest) {
      Object.assign(this, accessRequest);
    }
  }
}
