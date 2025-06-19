import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO для отзыва доступа к данным у кооператива
 */
export class RevokeAccessInputDTO {
  @ApiProperty({
    description: 'Имя пользователя, чьи данные отзываются',
    example: 'username123',
  })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'Название кооператива, у которого отзывается доступ',
    example: 'coop_example',
  })
  @IsString()
  @IsNotEmpty()
  coopname!: string;
}
