import { z } from 'zod'

export const TBA_USER_SCHEMA = z.object({
  ownerAddress: z.string().startsWith('0x'),
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
  mintAmount: z.number().int().min(1).max(2),
})

export const SCROLLER_USER_CONFIG_SCHEMA = z.object({
  depositAmount: z.string(),
  mintAmount: z.number().int().min(1).max(2),
  gasTolerance: z.number().int().min(0).max(3),
  email: z.union([z.literal(''), z.string().email()]).optional(),
})
