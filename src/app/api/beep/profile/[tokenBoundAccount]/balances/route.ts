import { NextResponse } from 'next/server'

import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'

import { alchemy } from '@/lib/alchemy'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const tokens = { ...TOKENS_FROM, ...TOKENS_TO }

  try {
    const balances = await alchemy.core.getTokenBalances(tokenBoundAccount, Object.keys(tokens))

    return NextResponse.json(
      Object.fromEntries(balances.tokenBalances.map(_balance => [_balance.contractAddress, `${parseInt(_balance.tokenBalance || '0')}`]))
    )
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
