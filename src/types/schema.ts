import { z } from 'zod'

export const TBA_USER_SCHEMA = z.object({
  ownerAddress: z.string().startsWith('0x'),
  frequency: z.number().int().positive(),
  amount: z.number().int().min(20),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})

export const TBA_USER_CONFIG_SCHEMA = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().min(20),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
  depositAmount: z.number().int().min(0),
  mintAmount: z.number().int().min(1).max(2),
})
