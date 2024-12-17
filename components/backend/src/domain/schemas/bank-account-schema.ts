import { z } from "zod";

// Подсхемы
export const BankAccountSchema = z.object({
  account_number: z.string(),
  bank_name: z.string(),
  card_number: z.string().optional(),
  currency: z.string(),
  details: z.object({
    bik: z.string(),
    corr: z.string(),
    kpp: z.string(),
  }),
});
