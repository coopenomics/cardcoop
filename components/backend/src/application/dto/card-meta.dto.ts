import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CardMetaDTO {
  @ApiProperty({
    description: 'Версия модели данных карты',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  version!: number;

  // Добавьте другие поля, если они нужны в метаданных
}