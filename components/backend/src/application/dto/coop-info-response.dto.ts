import { ApiProperty } from '@nestjs/swagger';

export class CoopInfoResponseDTO {
  @ApiProperty({
    description: 'Имя аккаунта кооператива',
    example: 'voskhod',
  })
  coopname!: string;

  @ApiProperty({
    description: 'Публичный ключ кооператива',
    example: 'EOS123456789abcdef',
  })
  public_key!: string;

  @ApiProperty({
    description: 'Публичное наименование кооператива',
    example: 'Потребительский Кооператив "РОМАШКА"',
  })
  announce!: string;

  
  constructor(data: CoopInfoResponseDTO) {
    Object.assign(this, data);
  }
}
