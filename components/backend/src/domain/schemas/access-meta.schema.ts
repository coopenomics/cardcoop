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

// схема меда-данных для передачи вместе с расшаренными данными
export const AccessMetaSchema = z
  .object({
    version: z.number(),
    issued_at: z.union([z.string(), z.date()]).transform(dateTransformer),
    requested_at: z.union([z.string(), z.date()]).transform(dateTransformer),
    device_id: z.string().optional(),
    device_type: z.string().optional(),
    operating_system: z.string().optional(),
    browser: z.string().optional(),
  })
  .strict();
