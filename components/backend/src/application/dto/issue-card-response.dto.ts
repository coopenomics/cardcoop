import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IssueCardResponseDTO {
  @ApiProperty({
    description: 'Уникальный идентификатор карты',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Имя пользователя, связанного с картой',
    example: 'username123',
  })
  @IsString()
  username!: string;
}
