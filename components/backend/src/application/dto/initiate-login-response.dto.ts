import { ApiProperty } from '@nestjs/swagger';

export class InitiateLoginResponseDTO {
  @ApiProperty({
    description: 'Уникальный идентификатор для регистрации',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  uuid!: string;

  @ApiProperty({
    description: 'Серверная соль для защиты данных',
    example: 'random-server-salt-example',
  })
  salt!: string;

  constructor(data: InitiateLoginResponseDTO) {
    Object.assign(this, data);
  }
}
