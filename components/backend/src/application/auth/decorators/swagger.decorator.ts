import { ApiOperation } from '@nestjs/swagger';

export function Swagger(description: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const operationId = propertyKey; // Используем только имя метода
    const summary = propertyKey;

    ApiOperation({
      summary,
      description,
      operationId,
    })(target, propertyKey, descriptor);
  };
}