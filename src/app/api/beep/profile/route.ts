import { NextResponse } from 'next/server'
import { Utils } from 'alchemy-sdk'
import { fromZodError } from 'zod-validation-error'
import dayjs from 'dayjs'
import { z } from 'zod'

import { prismaClient } from '@/lib/prisma'

import { batchSwap } from '@/utils/admin_swap'

import { TOKENS_FROM } from '@/constants/token'
import { GAS_FEE_PROPORTION, BEEP_FEE_PROPORTION } from '@/constants/fee'

const schema = z.object({
  ownerAddress: z.string().startsWith('0x'),
  addresses: z.array(z.string().startsWith('0x')),
  frequency: z.number().int().positive(),
  amount: z.number().int().min(60),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})

export const runtime = 'nodejs'

// This is account creation in batch
// To create a single account, call POST /api/beep/profile/[tokenBoundAccount]
export async function POST(request: Request) {
  const body = await request.json()

  const validation = schema.safeParse({ ...body, amount: +body.amount, frequency: +body.frequency })
  if (!validation.success) {
    return NextResponse.json({ error: fromZodError(validation.error).details }, { status: 400 })
  }

  const now = dayjs()

  try {
    const tbaUser = await prismaClient.tBAUser.findMany({
      where: {
        address: {
          in: validation.data.addresses,
        },
      },
    })

    if (tbaUser.length) {
      return NextResponse.json({ error: `User ${tbaUser[0].address} already exists` }, { status: 400 })
    }

    const result = await prismaClient.tBAUser.createMany({
      data: (body.addresses as string[]).map(_address => ({
        address: _address,
        owner_address: validation.data.ownerAddress,
        amount: validation.data.amount,
        token_address_from: validation.data.tokenAddressFrom,
        token_address_to: validation.data.tokenAddressTo,
        frequency: validation.data.frequency,
        end_date: validation.data.endDate,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        is_active: true,
        next_swap: now.add(validation.data.frequency, 'day').toISOString(),
      })),
    })

    const tx = await batchSwap(
      validation.data.addresses.map(_address => ({
        swapContract: _address,
        tokenIn: validation.data.tokenAddressFrom,
        tokenOut: validation.data.tokenAddressTo,
        amountIn: validation.data.amount,
        beepFee: Utils.parseUnits(
          String(validation.data.amount * BEEP_FEE_PROPORTION),
          TOKENS_FROM[validation.data.tokenAddressFrom].decimal
        ),
        gasFee: Utils.parseUnits(
          String(validation.data.amount * GAS_FEE_PROPORTION),
          TOKENS_FROM[validation.data.tokenAddressFrom].decimal
        ),
      }))
    )

    return NextResponse.json({ count: result.count, tx })
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
