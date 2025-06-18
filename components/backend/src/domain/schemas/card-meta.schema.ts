import { z } from 'zod';

/**
 * Схема метаданных карты пайщика
 * Содержит информацию о версии, датах выпуска и валидности карты
 */
export const CardMetaSchema = z.object({
  version: z.number(), // Версия формата карты
  issued_at: z.date(), // Дата выпуска
  valid_until: z.date().optional(), // Дата действия (опционально)
  card_type: z.string(), // Тип карты (standard, premium и т.д.)
  is_active: z.boolean().default(true), // Активна ли карта
});
