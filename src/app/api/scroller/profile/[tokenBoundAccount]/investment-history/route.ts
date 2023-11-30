import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { alchemyScoller as alchemy } from '@/lib/alchemy'

const SWAP_CONTRACT_ADDRESSES = '0x13FBE0D0e5552b8c9c4AE9e2435F38f37355998a'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const transactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
      excludeZeroValue: true,
      fromAddress: tokenBoundAccount,
      toAddress: SWAP_CONTRACT_ADDRESSES,
      fromBlock: '0x0',
      toBlock: 'latest',
      order: SortingOrder.DESCENDING,
      withMetadata: true,
    })

    const response = transactions?.transfers || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get investment history' }, { status: 500 })
  }
}
