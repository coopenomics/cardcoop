import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для входных данных отзыва доступа у кооператива
 */
export class RevokeAccessInputDTO {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'username',
  })
  @IsString()
  @IsNotEmpty()
  username: string = '';

  @ApiProperty({
    description: 'Имя кооператива',
    example: 'coopname',
  })
  @IsString()
  @IsNotEmpty()
  coopname: string = '';
}
