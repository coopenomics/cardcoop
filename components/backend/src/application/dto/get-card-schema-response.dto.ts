import { ApiProperty } from '@nestjs/swagger';

class SchemaItem {
  @ApiProperty({ example: 'object', description: 'Type of the schema' })
  type!: string;

  @ApiProperty({ description: 'Properties of the schema' })
  properties!: Record<string, any>;

  @ApiProperty({ example: ['field1', 'field2'], description: 'Required fields', required: false })
  required?: string[];
}

export class SchemaResponseDTO {
  @ApiProperty({ type: [SchemaItem], description: 'List of schema variants based on type' })
  oneOf!: SchemaItem[];
}
