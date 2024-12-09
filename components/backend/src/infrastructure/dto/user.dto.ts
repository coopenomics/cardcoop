import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateRegistrationDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class CompleteRegistrationDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Хэш-ключ для завершения регистрации',
    example: 'secureHash123',
  })
  @IsString()
  hashKey: string;

  @ApiProperty({
    description: 'Уникальный идентификатор запроса',
    example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  uuid: string;
}

export class InitiateLoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class CompleteLoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Хэш-ключ для завершения входа',
    example: 'secureHash123',
  })
  @IsString()
  hashKey: string;

  @ApiProperty({
    description: 'Уникальный идентификатор запроса',
    example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  uuid: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Токен доступа для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Токен для обновления доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
