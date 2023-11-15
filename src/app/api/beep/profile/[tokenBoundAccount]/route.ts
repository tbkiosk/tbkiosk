import { Utils } from 'alchemy-sdk'
import { NextResponse } from 'next/server'
import { fromZodError } from 'zod-validation-error'
import dayjs from 'dayjs'

import { prismaClient } from '@/lib/prisma'

import { TBA_USER_SCHEMA } from '@/types/schema'

import { swapSingleUser } from '@/utils/admin_swap'

import { TOKENS_FROM } from '@/constants/token'
import { GAS_FEE_PROPORTION, BEEP_FEE_PROPORTION } from '@/constants/fee'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const tbaUser = await prismaClient.tBAUser.findFirst({
      where: {
        address: {
          equals: tokenBoundAccount,
        },
      },
    })

    return NextResponse.json(tbaUser)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const tbaUser = await prismaClient.tBAUser.findFirst({
      where: {
        address: {
          equals: tokenBoundAccount,
        },
      },
    })

    if (!tbaUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    const body = await request.json()
    const validation = TBA_USER_SCHEMA.safeParse({ ...body, amount: +body.amount, frequency: +body.frequency })
    if (!validation.success) {
      return NextResponse.json({ error: fromZodError(validation.error).details }, { status: 400 })
    }

    const now = dayjs()

    const updatedTbaUser = await prismaClient.tBAUser.update({
      where: {
        address: tokenBoundAccount,
      },
      data: {
        amount: validation.data.amount,
        token_address_from: validation.data.tokenAddressFrom,
        token_address_to: validation.data.tokenAddressTo,
        frequency: validation.data.frequency,
        end_date: validation.data.endDate,
        updated_at: now.toISOString(),
        next_swap: now.add(validation.data.frequency, 'day').toISOString(),
      },
    })

    const tx = await swapSingleUser({
      swapContract: tokenBoundAccount,
      beepFee: Utils.parseUnits(
        String(validation.data.amount * BEEP_FEE_PROPORTION),
        TOKENS_FROM[validation.data.tokenAddressFrom].decimal
      ),
      gasFee: Utils.parseUnits(String(validation.data.amount * GAS_FEE_PROPORTION), TOKENS_FROM[validation.data.tokenAddressFrom].decimal),
      tokenOut: validation.data.tokenAddressTo,
      tokenIn: validation.data.tokenAddressFrom,
      amountIn: validation.data.amount,
    })

    return NextResponse.json({ user: updatedTbaUser, tx })
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
