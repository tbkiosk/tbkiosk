/* eslint-disable no-console */

import { NextResponse } from 'next/server'
import dayjs from 'dayjs'
// import { ethers } from 'ethers'

import { prismaClient } from '@/lib/prisma'
// import { BEEP_API } from '@/lib/abi'

// import { env } from 'env.mjs'

import type { TBAUser } from '@prisma/client'

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

export const swapSingleUser = async (user: TBAUser) => {
  const userToUpdate = await prismaClient.tBAUser.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!userToUpdate) {
    throw new Error('User not found')
  }

  // TODO: swap logic
  // const alchemyProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_PROVIDER_API_URL_MAP[env.NEXT_PUBLIC_CHAIN_ID])
  // const signer = new ethers.Wallet(env.PRIVATE_KEY, alchemyProvider)
  // const beepContract = new ethers.Contract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS, BEEP_API, signer)

  // const gasPrice = await alchemyProvider.getGasPrice()

  // const tx = await beepContract.swapExactInputSingle(
  //   user.token_address_from, //tokenIn
  //   user.token_address_to, //tokenOut
  //   user.amount,
  //   4000000, //gasFee
  //   1000000, //beepFee
  //   {
  //     gasPrice: gasPrice,
  //     gasLimit: 500000,
  //   }
  // )

  // console.log(tx)

  const updatedTbaUser = await prismaClient.tBAUser.update({
    where: {
      id: user.id,
    },
    data: {
      last_swap: userToUpdate.next_swap,
      next_swap: dayjs(userToUpdate.next_swap).add(userToUpdate.frequency, 'days').toDate(),
    },
  })

  return updatedTbaUser
}
