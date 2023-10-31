import { NextResponse } from 'next/server'
import { z } from 'zod'
import dayjs from 'dayjs'

import { prismaClient } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function PUT(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount
  const body = await request.json()

  const schema = z.object({
    isActive: z.boolean(),
  })

  const validation = schema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 })
  }

  try {
    const updatedTbaUser = await prismaClient.tBAUser.update({
      where: {
        address: tokenBoundAccount,
      },
      data: {
        is_active: validation.data.isActive,
        updated_at: dayjs().toISOString(),
      },
    })

    return NextResponse.json(updatedTbaUser)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
