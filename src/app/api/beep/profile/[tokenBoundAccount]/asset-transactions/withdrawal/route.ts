import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { ALCHEMY_CONFIG } from '@/constants/alchemy'
import { TOKENS_FROM, TOKENS_TO } from '@/constants/token'
import { TransactionType } from '@/constants/transactions'

const alchemy = new Alchemy(ALCHEMY_CONFIG)

const SWAP_CONTRACT_ADDRESSES = ['0x6337b3caf9c5236c7f3d1694410776119edaf9fa', '0x449f07dc7616c43b47dbe8cf57dc1f6e34ef82f8']

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
      order: SortingOrder.DESCENDING,
      toBlock: 'latest',
      withMetadata: true,
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
