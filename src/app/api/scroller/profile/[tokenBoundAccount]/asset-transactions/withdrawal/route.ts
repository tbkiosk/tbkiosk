import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

// import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { TransactionType } from '@/types/transactions'

import { alchemyScoller as alchemy } from '@/lib/alchemy'

const SWAP_CONTRACT_ADDRESSES = ['0x13FBE0D0e5552b8c9c4AE9e2435F38f37355998a']

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const withdrawalTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.INTERNAL],
      excludeZeroValue: true,
      fromBlock: '0x0',
      toBlock: 'latest',
      fromAddress: tokenBoundAccount,
      order: SortingOrder.DESCENDING,
      withMetadata: true,
      maxCount: 3,
    })

    const response =
      withdrawalTransactions?.transfers
        ?.map(_tx => ({ ..._tx, type: TransactionType.WITHDRAWAL }))
        .filter(_tx => !SWAP_CONTRACT_ADDRESSES.includes(_tx.to || '')) || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get withdrawal transactions' }, { status: 500 })
  }
}

/**
 * WITHDRAWALS:
 *
 * 1. MANUAL WITHDRAWALS:
 *  - External
 *  - From TokenBoundAccount to ALL
 *
 * 2. WITHDRAW BY BRIDGE:
 *  - Internal
 *  - From NFT Contract to L1 GATEWAY
 */
