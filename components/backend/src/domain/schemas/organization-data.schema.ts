import { z } from "zod";
import { BankAccountSchema } from "./bank-account-schema";

export const OrganizationDataSchema = z.object({
  bank_account: BankAccountSchema,
  city: z.string(),
  country: z.string(),
  details: z.object({
    inn: z.string(),
    kpp: z.string(),
    ogrn: z.string(),
  }),
  email: z.string().email(),
  fact_address: z.string(),
  full_address: z.string(),
  full_name: z.string(),
  phone: z.string(),
  represented_by: z.object({
    based_on: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    middle_name: z.string(),
    position: z.string(),
  }),
  short_name: z.string(),
  name: z.string(),
  type: z.enum(["coop", "ooo", "oao", "zao", "pao", "ao"]),
});
