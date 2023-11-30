import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

// import { TOKENS_FROM } from '@/constants/token'
import { TransactionType } from '@/types/transactions'

import { alchemyScoller as alchemy } from '@/lib/alchemy'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const depositTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
      excludeZeroValue: true,
      fromBlock: '0x0',
      toBlock: 'latest',
      order: SortingOrder.DESCENDING,
      toAddress: tokenBoundAccount,
      withMetadata: true,
      maxCount: 3,
    })

    const response = depositTransactions?.transfers?.map(_tx => ({ ..._tx, type: TransactionType.DEPOSIT })) || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get deposit transactions' }, { status: 500 })
  }
}

/**
 * DEPOSITS:
 *
 * 1. MANUAL DEPOSITS:
 *  - External
 *  - From Owner to TokenBoundAccount
 *
 * 2. DEPOSIT ON MINT:
 *  - Internal
 *  - From NFT Contract to TokenBoundAccount
 */
