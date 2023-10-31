import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'
import dayjs from 'dayjs'

import { prismaClient } from '@/lib/prisma'

const TBA_USER_SCHEMA = z.object({
  frequency: z.number().int().positive(),
  amount: z.number().int().positive(),
  tokenAddressFrom: z.string().startsWith('0x'),
  tokenAddressTo: z.string().startsWith('0x'),
  endDate: z.string().datetime().nullable(),
})

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

export async function POST(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount
  const body = await request.json()

  const validation = TBA_USER_SCHEMA.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: fromZodError(validation.error).details }, { status: 400 })
  }

  const now = dayjs()

  try {
    const tbaUser = await prismaClient.tBAUser.findFirst({
      where: {
        address: {
          equals: tokenBoundAccount,
        },
      },
    })

    if (tbaUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const newTbaUser = await prismaClient.tBAUser.create({
      data: {
        address: tokenBoundAccount,
        amount: validation.data.amount,
        token_address_from: validation.data.tokenAddressFrom,
        token_address_to: validation.data.tokenAddressTo,
        frequency: validation.data.frequency,
        end_date: validation.data.endDate,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        is_active: true,
        last_swap: null,
        next_update: now.add(validation.data.frequency, 'day').toISOString(),
      },
    })

    return NextResponse.json(newTbaUser)
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
    const validation = TBA_USER_SCHEMA.safeParse(body)
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
        next_update: now.add(validation.data.frequency, 'day').toISOString(),
      },
    })

    return NextResponse.json(updatedTbaUser)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
