import { z } from 'zod';

// схема меда-данных для передачи вместе с расшаренными данными
export const AccessMetaSchema = z.object({
  version: z.number(), 
  issued_at: z.date(),
  requested_at: z.date(),
  device_id: z.string().optional(),
  device_type: z.string().optional(),
  operating_system: z.string().optional(),
  browser: z.string().optional(),  
}).strict();
