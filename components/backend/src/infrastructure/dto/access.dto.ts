import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PrepareShareDataDto {
  @ApiProperty({
    description: 'Название кооператива',
    example: 'CoopNameXYZ',
  })
  @IsString()
  @IsNotEmpty()
  coopName: string;
}

export class CoopInfoResponseDto {
  @ApiProperty({
    description: 'Название кооператива',
    example: 'CoopNameXYZ',
  })
  coopName: string;

  @ApiProperty({
    description: 'Публичный ключ кооператива',
    example: 'publicKey123456789abcdef',
  })
  coopPublicKey: string;
}

export class ShareDataDto {
  @ApiProperty({
    description: 'Название кооператива',
    example: 'CoopNameXYZ',
  })
  @IsString()
  @IsNotEmpty()
  coopName: string;

  @ApiProperty({
    description: 'Зашифрованные данные для передачи',
    example: 'encryptedData123456abcdef',
  })
  @IsString()
  @IsNotEmpty()
  encryptedData: string;
}

export class ShareDataResponseDto {
  @ApiProperty({
    description: 'Билет для обмена данными',
    example: 'exchangeTicket12345',
  })
  ticket: string;
}

export class CoopExchangeTicketDto {
  @ApiProperty({
    description: 'Билет для обмена кооперативной информацией',
    example: 'exchangeTicket12345',
  })
  @IsString()
  @IsNotEmpty()
  ticket: string;
}

export class CoopJwtResponseDto {
  @ApiProperty({
    description: 'JWT токен доступа для взаимодействия с кооперативом',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
