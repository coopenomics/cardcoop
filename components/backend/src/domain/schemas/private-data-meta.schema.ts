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
 * Схема метаданных приватных данных пользователя
 * Включает версию формата данных и дату создания
 */
export const PrivateDataMetaSchema = z.object({
  version: z.number(), // Обязательное поле версии формата
  created_at: z.union([z.string(), z.date()]).transform(dateTransformer), // Дата создания
  updated_at: z.union([z.string(), z.date()]).transform(dateTransformer), // Дата последнего обновления
  data_type: z.string(), // Тип данных (personal, business и т.д.)
});
