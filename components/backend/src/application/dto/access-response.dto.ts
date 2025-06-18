import { ApiProperty } from '@nestjs/swagger';
import { AccessRequest } from 'src/domain/entities/access-request.entity';
import { AccessMetaDomainInterface } from 'src/domain/interfaces/access-meta.interface';

/**
 * DTO для ответа со списком доступов
 */
export class AccessResponseDTO {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'username',
  })
  username: string;

  @ApiProperty({
    description: 'Имя кооператива',
    example: 'coopname',
  })
  coopname: string;

  @ApiProperty({
    description: 'Публичный ключ кооператива',
    example: 'EOS8mUftJXepGzdQ2TaCduNuSPAfXJHf22uex4u41ab1EVv9EAhWt',
  })
  public_key: string;

  @ApiProperty({
    description: 'Метаданные доступа',
    type: Object,
  })
  meta: AccessMetaDomainInterface;

  @ApiProperty({
    description: 'Дата предоставления доступа',
    example: '2023-01-01T00:00:00.000Z',
  })
  created_at: Date;

  constructor(entity: AccessRequest) {
    this.username = entity.username;
    this.coopname = entity.coopname;
    this.public_key = entity.public_key;
    this.meta = entity.meta;
    this.created_at = entity.meta.requested_at;
  }
}
