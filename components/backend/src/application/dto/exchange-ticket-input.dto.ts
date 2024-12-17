import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';


export class ExchangeTicketInputDTO {
  @ApiProperty({
    description: 'Билет для обмена кооперативной информацией',
    example: 'exchangeTicket12345',
  })
  @IsString()
  @IsNotEmpty()
  ticket!: string;
}
