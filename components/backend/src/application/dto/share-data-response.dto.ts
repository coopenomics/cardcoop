import { ApiProperty } from '@nestjs/swagger';


export class ShareDataResponseDTO {
  @ApiProperty({
    description: 'Билет для обмена данными',
    example: 'exchangeTicket12345',
  })
  ticket: string;

  constructor(ticket: string) {
    this.ticket = ticket;
  }
}
