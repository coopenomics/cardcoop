import { z } from 'zod';

/**
 * Схема метаданных приватных данных пользователя
 * Включает версию формата данных и дату создания
 */
export const PrivateDataMetaSchema = z.object({
  version: z.number(), // Обязательное поле версии формата
  created_at: z.date(), // Дата создания
  updated_at: z.date(), // Дата последнего обновления
  data_type: z.string(), // Тип данных (personal, business и т.д.)
});
