import { z } from "zod";
import { BankAccountSchema } from "./bank-account-schema";

export const EntrepreneurDataSchema = z.object({
  bank_account: BankAccountSchema,
  birthdate: z.string(),
  city: z.string(),
  country: z.enum(["Russia", "Other"]),
  details: z.object({
    inn: z.string(),
    ogrn: z.string(),
  }),
  email: z.string().email(),
  first_name: z.string(),
  full_address: z.string(),
  last_name: z.string(),
  middle_name: z.string(),
  phone: z.string(),
});
