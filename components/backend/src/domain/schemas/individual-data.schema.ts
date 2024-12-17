import { z } from "zod";

export const IndividualDataSchema = z.object({
  birthdate: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  full_address: z.string(),
  last_name: z.string(),
  middle_name: z.string(),
  passport: z
    .object({
      code: z.string(),
      issued_at: z.string(),
      issued_by: z.string(),
      number: z.number(),
      series: z.number(),
    })
    .optional(),
  phone: z.string(),
});
