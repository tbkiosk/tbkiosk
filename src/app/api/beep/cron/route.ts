/* eslint-disable no-console */

import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
// import { ethers } from 'ethers'

import { prismaClient } from '@/lib/prisma'
// import { BEEP_API } from '@/lib/abi'

import { swapSingleUser } from '@/utils/swap'

// import { env } from 'env.mjs'

const MAX_USER_CONCURRENCY = 2

// const ALCHEMY_PROVIDER_API_URL_MAP = {
//   '1': 'https://eth-mainnet.g.alchemy.com/v2/',
//   '5': 'https://eth-goerli.g.alchemy.com/v2/',
//   '137': 'https://polygon-mainnet.g.alchemy.com/v2/',
// } as { [key in typeof env.NEXT_PUBLIC_CHAIN_ID]: string }

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

    const results = await Promise.allSettled(usersToSwap.slice(0, MAX_USER_CONCURRENCY).map(_userToUpdate => swapSingleUser(_userToUpdate)))

    console.log(results)
    return NextResponse.json(results)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
