import type { z } from 'zod';
import type { PrivateDataMetaSchema } from '../schemas/private-data-meta.schema';

/**
 * Интерфейс для метаданных приватных данных,
 * сгенерированный из схемы Zod
 */
export type PrivateDataMetaInterface = z.infer<typeof PrivateDataMetaSchema>;
