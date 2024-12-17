import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenInputDTO {
  @ApiProperty({
    description: 'Refresh-токен для обновления токена доступа',
    example: 'refreshtoken123',
  })
  @IsString()
  refresh_token!: string;
}
