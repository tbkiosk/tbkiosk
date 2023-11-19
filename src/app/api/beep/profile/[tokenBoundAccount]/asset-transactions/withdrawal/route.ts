import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory } from 'alchemy-sdk'

import { ALCHEMY_CONFIG } from '@/constants/alchemy'
import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'

const alchemy = new Alchemy(ALCHEMY_CONFIG)

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const withdrawalTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.ERC20],
      contractAddresses: [...Object.keys(TOKENS_FROM), ...Object.keys(TOKENS_TO)],
      excludeZeroValue: true,
      fromBlock: '0x0',
      fromAddress: tokenBoundAccount,
      toBlock: 'latest',
    })

    return NextResponse.json(withdrawalTransactions)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get withdrawal transactions' }, { status: 500 })
  }
}
