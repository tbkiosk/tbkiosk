import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { TransactionType } from '@/types/transactions'

import { alchemyScoller as alchemy } from '@/lib/alchemy'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()
    const { tokenBoundAccount, tbaOwner } = requestBody

    const withdrawalTransactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.INTERNAL],
      excludeZeroValue: true,
      fromBlock: '0x0',
      toBlock: 'latest',
      fromAddress: tokenBoundAccount,
      order: SortingOrder.DESCENDING,
      withMetadata: true,
    })

    const response =
      withdrawalTransactions?.transfers
        ?.map(_tx => ({ ..._tx, type: TransactionType.WITHDRAWAL }))
        .filter(_tx => [tbaOwner.toLowerCase()].includes(_tx.to || '')) || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get withdrawal transactions' }, { status: 500 })
  }
}
