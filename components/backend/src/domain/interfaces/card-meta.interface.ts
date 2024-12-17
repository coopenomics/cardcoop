import type { z } from "zod";
import type { CardMetaSchema } from "../schemas/card-meta.schema";

// Выводим тип данных для `meta` из схемы
export type CardMetaDomainInterface= z.infer<typeof CardMetaSchema>;
