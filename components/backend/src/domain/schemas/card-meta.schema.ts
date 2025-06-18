import { z } from 'zod';

/**
 * Преобразует строку даты в объект Date
 * @param date Дата в виде строки или объекта Date
 * @returns Объект Date
 */
const dateTransformer = (date: string | Date): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

/**
 * Схема метаданных карты пайщика
 * Содержит информацию о версии, датах выпуска и валидности карты
 */
export const CardMetaSchema = z.object({
  version: z.number(), // Версия формата карты
  issued_at: z.union([z.string(), z.date()]).transform(dateTransformer), // Дата выпуска
  valid_until: z
    .union([z.string(), z.date()])
    .transform(dateTransformer)
    .optional(), // Дата действия (опционально)
  card_type: z.string(), // Тип карты (standard, premium и т.д.)
  is_active: z.boolean().default(true), // Активна ли карта
});
