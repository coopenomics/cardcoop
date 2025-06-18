import { BadRequestException } from "@nestjs/common";
import type { AccessMetaDomainInterface } from "../interfaces/access-meta.interface";
import { AccessMetaSchema } from "../schemas/access-meta.schema";

export class AccessRequest {
  id!: string;
  ticket!: string;
  username!: string;
  coopname!: string;
  encrypted_data!: string;
  public_key!: string;
  ticket_is_used!: boolean;
  meta!: AccessMetaDomainInterface;

  constructor(data: AccessRequest) {
    Object.assign(this, data);

    // Валидация meta через Zod
    const validationResult = AccessMetaSchema.safeParse(data.meta);
    if (!validationResult.success) {
      throw new BadRequestException(
        `Invalid meta: ${validationResult.error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ')}`,
      );
    }
    this.meta = validationResult.data; // Сохраняем валидированное значение
  }
}
