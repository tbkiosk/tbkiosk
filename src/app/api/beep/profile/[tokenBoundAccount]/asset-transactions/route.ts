import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory, Network, SortingOrder } from 'alchemy-sdk'

import { env } from 'env.mjs'

export type TransferTransaction = {
  isSuccess: boolean
  hash: string
  value: number
  timestamp: string
  type: 'Deposit' | 'Withdraw'
  currency: string
}

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const config = {
    apiKey: env.ALCHEMY_KEY,
    network: Network.MATIC_MAINNET,
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

    const wethContract = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
    const feeWallet = '0x88f92ba0D9E7C91F5B67A9B31c4Fe917141447AF'

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
          currency: 'USDC',
        }
      })

    const usdcWithdraw = withdrawData.transfers
      .filter(transfer => {
        if (transfer.to === feeWallet) return false
        else if (transfer.asset !== 'USDC') return false
        else return transfer.to !== wethContract
      })
      .map(item => {
        return {
          isSuccess: true,
          hash: item.hash,
          value: item.value,
          timestamp: item.metadata.blockTimestamp,
          type: 'Withdraw',
          currency: item.asset,
        }
      })

    const result = [...usdcDeposit, ...usdcWithdraw].sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf())

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', detail: error }, { status: 500 })
  }
}
