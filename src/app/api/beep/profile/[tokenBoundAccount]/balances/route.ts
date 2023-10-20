import { NextResponse } from 'next/server'
import { Alchemy, Network } from 'alchemy-sdk'

import { env } from 'env.mjs'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: Network.MATIC_MAINNET,
  }

  const usdcContract = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  const wethContract = '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'

  try {
    const alchemy = new Alchemy(config)

    const tokenBalances = await alchemy.core.getTokenBalances(tokenBoundAccount, [usdcContract, wethContract])

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
