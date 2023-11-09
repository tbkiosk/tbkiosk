/* eslint-disable no-console */

import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

// import { batchSwap } from '@/utils/adminSwap'

import { prismaClient } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const usersToSwap = await prismaClient.tBAUser.findMany({
      where: {
        next_swap: {
          lte: dayjs().toDate(),
        },
        is_active: true,
        OR: [
          {
            end_date: {
              gte: dayjs().toDate(),
            },
          },
          {
            end_date: {
              equals: null,
            },
          },
        ],
      },
    })

    const results = usersToSwap

    console.log(results)
    return NextResponse.json(results)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
