import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { TransactionType } from '@/types/transactions'

import { alchemyScoller as alchemy } from '@/lib/alchemy'

const SWAP_CONTRACT_ADDRESSES = ['0xa2d937f18e9e7fc8d295ecaebb10acbd5e77e9ec'] // signer

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
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
        .filter(_tx => SWAP_CONTRACT_ADDRESSES.includes(_tx.to || '')) || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get withdrawal transactions' }, { status: 500 })
  }
}
