import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory } from 'alchemy-sdk'

import { ALCHEMY_CONFIG } from '@/constants/alchemy'
import { TOKENS_FROM } from '@/constants/token'

const alchemy = new Alchemy(ALCHEMY_CONFIG)

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const depositTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.ERC20],
      contractAddresses: [...Object.keys(TOKENS_FROM)],
      excludeZeroValue: true,
      fromBlock: '0x0',
      toAddress: tokenBoundAccount,
      toBlock: 'latest',
      withMetadata: true,
    })

    return NextResponse.json(depositTransactions)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get deposit transactions' }, { status: 500 })
  }
}
