import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';


export class CompleteLoginInputDTO {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Хэш-ключ для завершения входа',
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
}
