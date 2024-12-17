import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';


export class InitiateRegistrationInputDTO {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;
}
