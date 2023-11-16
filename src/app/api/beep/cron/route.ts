/* eslint-disable no-console */

import { NextResponse } from 'next/server'
import { Utils } from 'alchemy-sdk'
import dayjs from 'dayjs'

import { batchSwap } from '@/utils/admin_swap'

import { TOKENS_FROM } from '@/constants/token'
import { GAS_FEE_PROPORTION, BEEP_FEE_PROPORTION } from '@/constants/fee'

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

    const tx = await batchSwap(
      usersToSwap.map(_user => ({
        swapContract: _user.address,
        tokenIn: _user.token_address_from,
        tokenOut: _user.token_address_to,
        amountIn: _user.amount,
        beepFee: Utils.parseUnits(String(_user.amount * BEEP_FEE_PROPORTION), TOKENS_FROM[_user.token_address_from].decimal),
        gasFee: Utils.parseUnits(String(_user.amount * GAS_FEE_PROPORTION), TOKENS_FROM[_user.token_address_from].decimal),
      }))
    )

    if (tx) {
      const now = dayjs()
      const updatedTbaUsers = await prismaClient.$transaction(
        usersToSwap.map(_user =>
          prismaClient.tBAUser.update({
            where: {
              address: _user.address,
            },
            data: {
              next_swap: now.add(_user.frequency, 'day').toISOString(),
            },
          })
        )
      )

      return NextResponse.json({ tx, users: updatedTbaUsers })
    }

    return NextResponse.json({ tx, users: [] })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
