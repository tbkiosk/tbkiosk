import { z } from 'zod'

export const TBA_USER_SCHEMA = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().min(60),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})

export const TBA_USER_CONFIG_SCHEMA = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().min(60),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
  depositAmount: z.number().int().min(0),
  mintAmount: z.number().int().min(0),
})