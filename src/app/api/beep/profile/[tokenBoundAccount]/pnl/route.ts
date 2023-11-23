import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { prismaClient } from '@/lib/prisma'
import { alchemy } from '@/lib/alchemy'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'

import { env } from 'env.mjs'

const SWAP_CONTRACT_ADDRESSES = '0x6337b3caf9c5236c7f3d1694410776119edaf9fa'

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

    if (!tbaUser) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 400 })
    }

    const [uTransactions, tokensTransactions] = await Promise.all([
      alchemy.core.getAssetTransfers({
        category: [AssetTransfersCategory.ERC20],
        contractAddresses: [...Object.keys(TOKENS_FROM)],
        excludeZeroValue: true,
        fromAddress: tokenBoundAccount,
        fromBlock: '0x0',
        order: SortingOrder.ASCENDING,
        toAddress: SWAP_CONTRACT_ADDRESSES,
        toBlock: 'latest',
        withMetadata: true,
      }),
      alchemy.core.getAssetTransfers({
        category: [AssetTransfersCategory.ERC20],
        contractAddresses: [...Object.keys(TOKENS_TO)],
        excludeZeroValue: true,
        fromAddress: SWAP_CONTRACT_ADDRESSES,
        fromBlock: '0x0',
        order: SortingOrder.DESCENDING,
        toAddress: tokenBoundAccount,
        toBlock: 'latest',
        withMetadata: true,
      }),
    ])

    const firstSwapDate = uTransactions?.transfers?.[0]?.metadata.blockTimestamp
    if (!firstSwapDate) {
      return NextResponse.json(null)
    }

    const uSwapAmount = uTransactions?.transfers?.reduce((acc, cur) => acc + (cur ? cur.value || 0 : 0), 0)

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(TOKENS_TO)
        .map(_token => _token.name)
        .join(',')}&vs_currencies=usd&x_cg_demo_api_key=${env.COIN_GECKO_KEY}`
    )

    if (!res.ok) {
      throw new Error(res.statusText)
    }

    const pricesMap: { [tokenName: string]: { usd: number } } = await res.json()

    const priceKeys = Object.keys(pricesMap)

    if (!tokensTransactions?.transfers?.every(_tx => priceKeys.includes(_tx.asset ? _tx.asset.toLowerCase() : ''))) {
      return NextResponse.json({ error: 'Some prices of the investment tokens are unknown ' }, { status: 500 })
    }

    const tokensPrice = tokensTransactions?.transfers?.reduce(
      (acc, cur) => acc + pricesMap[cur.asset ? cur.asset.toLowerCase() : ''].usd * (cur.value ? cur.value : 0),
      0
    )

    const pnl = tokensPrice - uSwapAmount

    return NextResponse.json(pnl)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
