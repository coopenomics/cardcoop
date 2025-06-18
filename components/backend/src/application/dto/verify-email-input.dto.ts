import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailInputDTO {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Код подтверждения из email',
    example: '123456',
  })
  @IsString()
  code!: string;

  @ApiProperty({
    description: 'Уникальный идентификатор запроса',
    example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  uuid!: string;
}
