import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutInputDTO {
  @ApiProperty({
    description: 'Access-токен для удаления',
    example: 'accesstoken123',
  })
  @IsString()
  access_token!: string;
  
  @ApiProperty({
    description: 'Refresh-токен для удаления',
    example: 'refreshtoken123',
  })
  @IsString()
  refresh_token!: string;
}
