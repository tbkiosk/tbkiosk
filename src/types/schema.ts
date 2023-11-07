import { z } from 'zod'

export const TBA_USER_SCHEMA = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().positive(),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})
