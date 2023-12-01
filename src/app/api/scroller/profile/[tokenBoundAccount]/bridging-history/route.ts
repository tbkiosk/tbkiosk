import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'
import { TransactionType } from '@/types/transactions'
import { alchemyScoller as alchemy } from '@/lib/alchemy'

const BRIDGE_ROUTER_ADDRESSES: string[] = ['0x13fbe0d0e5552b8c9c4ae9e2435f38f37355998a']
const GAS_PAYMASTER_ADDRESSES: string[] = ['0xc723db325afd24bed1bf0cc112e7ef3919bf36c7']

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

function getTransactionType(toAddress: string): TransactionType | null {
  if (BRIDGE_ROUTER_ADDRESSES.includes(toAddress)) {
    return TransactionType.BRIDGE
  } else if (GAS_PAYMASTER_ADDRESSES.includes(toAddress)) {
    return TransactionType.GAS
  }
  return null
}

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }): Promise<Response> {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const transactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.INTERNAL],
      excludeZeroValue: true,
      fromAddress: tokenBoundAccount,
      fromBlock: '0x0',
      toBlock: 'latest',
      order: SortingOrder.DESCENDING,
      withMetadata: true,
    })

    const response =
      transactions?.transfers
        ?.map(_tx => {
          const type = getTransactionType(_tx.to || '')
          return type ? { ..._tx, type } : null
        })
        .filter(_tx => _tx !== null) || []

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get investment history' }, { status: 500 })
  }
}
