import { NextResponse } from 'next/server'
import { Alchemy } from 'alchemy-sdk'

import { USDC_CONTRACT_ADDRESS, WETH_CONTRACT_ADDRESS } from '@/constants/token'
import { ALCHEMY_CONFIG } from '@/constants/alchemy'

import { env } from 'env.mjs'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const alchemy = new Alchemy(ALCHEMY_CONFIG)

    const tokenBalances = await alchemy.core.getTokenBalances(tokenBoundAccount, [
      USDC_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
      WETH_CONTRACT_ADDRESS[+env.NEXT_PUBLIC_CHAIN_ID as 1 | 5 | 137],
    ])

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
