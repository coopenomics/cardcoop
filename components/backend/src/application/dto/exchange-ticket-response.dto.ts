import { ApiProperty } from '@nestjs/swagger';

export class ExchangeTicketResponseDTO {
  @ApiProperty({
    description: 'JWT токен доступа для взаимодействия с кооперативом',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
  
  constructor(data: ExchangeTicketResponseDTO){
    this.access_token = data.access_token
  }
}
