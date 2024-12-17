import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class CompleteRegistrationInputDTO {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Хэш-ключ для завершения регистрации',
    example: 'secureHash123',
  })
  @IsString()
  hash_key!: string;

  @ApiProperty({
    description: 'Уникальный идентификатор запроса',
    example: 'uuid-123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  uuid!: string;
  
  @ApiProperty({
    description: 'Серверная соль для защиты данных',
    example: 'random-server-salt-example',
  })
  @IsString()
  salt!: string;
}
