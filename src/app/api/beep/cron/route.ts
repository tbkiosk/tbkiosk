/* eslint-disable no-console */

import { NextResponse } from 'next/server'
import { Utils, Wallet } from 'alchemy-sdk'
import dayjs from 'dayjs'

import { swapSingleUser } from '@/utils/admin_swap'

import { TOKENS_FROM } from '@/constants/token'
import { GAS_FEE_PROPORTION, BEEP_FEE_PROPORTION } from '@/constants/fee'

import { prismaClient } from '@/lib/prisma'
import { alchemy } from '@/lib/alchemy'

import { env } from 'env.mjs'

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

    if (!usersToSwap.length) {
      return NextResponse.json({ tx: [], user: [] })
    }

    const wallet = new Wallet(env.SWAP_PRIVATE_KEY, alchemy)
    const nonce = await alchemy.core.getTransactionCount(wallet.getAddress())
    const now = dayjs()

    const transactions = await Promise.allSettled(
      usersToSwap.map((_user, i) =>
        swapSingleUser({
          swapContract: _user.address,
          beepFee: Utils.parseUnits(String(_user.amount * BEEP_FEE_PROPORTION), TOKENS_FROM[_user.token_address_from].decimal),
          gasFee: Utils.parseUnits(String(_user.amount * GAS_FEE_PROPORTION), TOKENS_FROM[_user.token_address_from].decimal),
          tokenOut: _user.token_address_to,
          tokenIn: _user.token_address_from,
          amountIn: _user.amount,
          nonce: nonce + i,
        })
      )
    )

    const updatedUsers = await prismaClient.$transaction(
      usersToSwap.map(_user =>
        prismaClient.tBAUser.update({
          where: { address: _user.address },
          data: {
            next_swap: now.add(_user.frequency, 'day').toISOString(),
          },
        })
      )
    )

    return NextResponse.json({ user: updatedUsers, tx: transactions })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
