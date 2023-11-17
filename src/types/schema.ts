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
  depositAmount: z.number().min(0.005),
  mintAmount: z.number().int().min(1).max(2),
  gasTolerance: z.number().int().min(0).max(3),
  // gasTolerance: z.enum(['OFF', 'LOW', 'MED', 'HIGH']),
})

// // Define constants for gas tolerance levels
// const GAS_TOLERANCE_OFF = 0;
// const GAS_TOLERANCE_LOW = 1;
// const GAS_TOLERANCE_MED = 2;
// const GAS_TOLERANCE_HIGH = 3;

// // Map numeric values to gas tolerance strings
// const gasToleranceMap = {
//   [GAS_TOLERANCE_OFF]: "OFF",
//   [GAS_TOLERANCE_LOW]: "LOW",
//   [GAS_TOLERANCE_MED]: "MED",
//   [GAS_TOLERANCE_HIGH]: "HIGH",
// };
