import { NextResponse } from 'next/server'
import { Alchemy } from 'alchemy-sdk'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { ALCHEMY_CONFIG } from '@/constants/alchemy'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const tokens = { ...TOKENS_FROM, ...TOKENS_TO }

  try {
    const alchemy = new Alchemy(ALCHEMY_CONFIG)

    const balances = await alchemy.core.getTokenBalances(tokenBoundAccount, Object.keys(tokens))

    return NextResponse.json(
      Object.fromEntries(balances.tokenBalances.map(_balance => [_balance.contractAddress, `${parseInt(_balance.tokenBalance || '0')}`]))
    )
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
