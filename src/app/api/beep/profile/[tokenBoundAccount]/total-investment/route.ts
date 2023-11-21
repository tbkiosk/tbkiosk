import { NextResponse } from 'next/server'
import { AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'

import { alchemy } from '@/lib/alchemy'

const SWAP_CONTRACT_ADDRESSES = '0x6337b3caf9c5236c7f3d1694410776119edaf9fa'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const { searchParams } = new URL(request.url)
  const tokenAddress = searchParams.get('token_address')

  if (!tokenAddress) {
    return NextResponse.json([])
  }

  try {
    const transactions = await alchemy.core.getAssetTransfers({
      category: [AssetTransfersCategory.ERC20],
      contractAddresses: [tokenAddress],
      excludeZeroValue: true,
      fromAddress: tokenBoundAccount,
      fromBlock: '0x0',
      order: SortingOrder.DESCENDING,
      toAddress: SWAP_CONTRACT_ADDRESSES,
      toBlock: 'latest',
    })

    const totalInvt = transactions?.transfers.reduce((acc, cur) => acc + (cur?.value ?? 0), 0) ?? 0

    return NextResponse.json(totalInvt)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get total investment' }, { status: 500 })
  }
}
