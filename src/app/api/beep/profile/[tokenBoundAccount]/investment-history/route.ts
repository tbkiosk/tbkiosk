import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { TOKENS_TO } from '@/constants/token'

import { alchemy } from '@/lib/alchemy'

const SWAP_CONTRACT_ADDRESSES = '0x6337b3caf9c5236c7f3d1694410776119edaf9fa'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const withdrawalTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.ERC20],
      contractAddresses: [...Object.keys(TOKENS_TO)],
      excludeZeroValue: true,
      fromAddress: SWAP_CONTRACT_ADDRESSES,
      fromBlock: '0x0',
      order: SortingOrder.DESCENDING,
      toAddress: tokenBoundAccount,
      toBlock: 'latest',
      withMetadata: true,
    })

    const response = withdrawalTransactions?.transfers || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get withdrawal transactions' }, { status: 500 })
  }
}
