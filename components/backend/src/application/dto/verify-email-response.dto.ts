import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDTO {
  @ApiProperty({
    description: 'Статус верификации',
    example: true,
  })
  verified!: boolean;
}
