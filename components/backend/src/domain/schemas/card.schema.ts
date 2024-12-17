import { z } from "zod";
import { EntrepreneurDataSchema } from "./entrepreneur.schema";
import { IndividualDataSchema } from "./individual-data.schema";
import { OrganizationDataSchema } from "./organization-data.schema";

// Основная дискриминирующая схема
const cardSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("individual"),
    email: z.string().email(),
    username: z.string(),
    individual_data: IndividualDataSchema,
    entrepreneur_data: z.undefined(),
    organization_data: z.undefined(),
  }),
  z.object({
    type: z.literal("entrepreneur"),
    email: z.string().email(),
    username: z.string(),
    entrepreneur_data: EntrepreneurDataSchema,
    individual_data: z.undefined(),
    organization_data: z.undefined(),
  }),
  z.object({
    type: z.literal("organization"),
    email: z.string().email(),
    username: z.string(),
    organization_data: OrganizationDataSchema,
    individual_data: z.undefined(),
    entrepreneur_data: z.undefined(),
  }),
]);

export { cardSchema };
