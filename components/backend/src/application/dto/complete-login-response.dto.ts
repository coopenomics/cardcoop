import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteLoginResponseDTO {
  @ApiProperty({
    description: 'Токен доступа для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'Токен для обновления доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;
  
  constructor(access_token: string, refresh_token: string){
    this.access_token = access_token
    this.refresh_token = refresh_token
  }
}
