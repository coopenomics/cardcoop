import { z } from "zod";

// Определяем схему для поля `meta`
export const CardMetaSchema = z.object({
  version: z.number(), // Обязательное поле version
  issued_at: z.date(),
  // Другие поля можно добавить здесь, если нужно
})
