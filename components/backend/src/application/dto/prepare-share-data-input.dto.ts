import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PrepareShareDataInputDTO {
  @ApiProperty({
    description: 'Название кооператива',
    example: 'CoopNameXYZ',
  })
  @IsString()
  @IsNotEmpty()
  coopname!: string;
}
