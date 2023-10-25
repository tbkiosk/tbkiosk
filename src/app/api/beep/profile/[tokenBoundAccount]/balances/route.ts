import { NextResponse } from 'next/server'
import { Alchemy, Network } from 'alchemy-sdk'

import { USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from '@/constants/token'

import { env } from 'env.mjs'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
  }

  try {
    const alchemy = new Alchemy(config)

    const tokenBalances = await alchemy.core.getTokenBalances(tokenBoundAccount, [USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS])

    const usdc = `${parseInt(tokenBalances.tokenBalances[0].tokenBalance?.toString() || '0') / 10 ** 6}`
    const weth = `${parseInt(tokenBalances.tokenBalances[1].tokenBalance?.toString() || '0') / 10 ** 18}`

    return NextResponse.json({
      usdc,
      weth,
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
