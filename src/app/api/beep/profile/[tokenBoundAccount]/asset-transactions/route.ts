import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory, Network, SortingOrder } from 'alchemy-sdk'
import { env } from '../../../../../../../env.mjs'

export type TransferTransaction = {
  isSuccess: boolean
  hash: string
  value: number
  timestamp: string
  type: 'Deposit' | 'Withdraw'
}

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: Network.ETH_GOERLI,
  }

  try {
    const alchemy = new Alchemy(config)

    const depositDataPromise = alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      toAddress: tokenBoundAccount,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
      order: SortingOrder.DESCENDING,
      excludeZeroValue: true,
    })

    const withdrawPromise = alchemy.core.getAssetTransfers({
      fromBlock: '0x0',
      fromAddress: tokenBoundAccount,
      category: [AssetTransfersCategory.ERC20],
      withMetadata: true,
      order: SortingOrder.DESCENDING,
      excludeZeroValue: true,
    })

    const uniswapWethUsdcContract = '0x6337b3caf9c5236c7f3d1694410776119edaf9fa'
    const botWallet = '0x449f07dc7616c43b47dbe8cf57dc1f6e34ef82f8'

    const [depositData, withdrawData] = await Promise.all([depositDataPromise, withdrawPromise])

    const usdcDeposit = depositData.transfers
      .filter(transfer => {
        return transfer.asset === 'USDC'
      })
      .map(item => {
        return {
          isSuccess: true,
          hash: item.hash,
          value: item.value,
          timestamp: item.metadata.blockTimestamp,
          type: 'Deposit',
        }
      })

    const usdcWithdraw = withdrawData.transfers
      .filter(transfer => {
        if (transfer.to === botWallet) return false
        else if (transfer.asset !== 'USDC') return false
        else return transfer.to !== uniswapWethUsdcContract
      })
      .map(item => {
        return {
          isSuccess: true,
          hash: item.hash,
          value: item.value,
          timestamp: item.metadata.blockTimestamp,
          type: 'Withdraw',
        }
      })

    const result = [...usdcDeposit, ...usdcWithdraw].sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf())

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', detail: error }, { status: 500 })
  }
}
