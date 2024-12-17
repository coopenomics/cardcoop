import type { z } from "zod";
import type { AccessMetaSchema } from "../schemas/access-meta.schema";

// Выводим тип данных для `meta` из схемы
export type AccessMetaDomainInterface= z.infer<typeof AccessMetaSchema>;
