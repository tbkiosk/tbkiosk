import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory, Network, SortingOrder } from 'alchemy-sdk'

import { env } from 'env.mjs'
import { utils, BigNumber } from 'ethers'

export type TransferTransaction = {
  isSuccess: boolean
  hash: string
  value: number
  timestamp: string
  type: 'Deposit' | 'Withdraw'
  currency: string
}

type ScanTransaction = {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  from: string
  contractAddress: string
  to: string
  value: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  transactionIndex: string
  gas: string
  gasPrice: string
  gasUsed: string
  cumulativeGasUsed: string
  input: string
  confirmations: string
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

    const key = env.POLYGONSCAN_KEY
    const wethTransactionResponse = await fetch(
      `https://api.polygonscan.com/api?module=account&action=tokentx&contractaddress=${wethContract}&address=${tokenBoundAccount}&page=1&offset=500&startblock=0&endblock=99999999&sort=asc&apikey=${key}`
    )
    const wethTransactionData = await wethTransactionResponse.json()
    const wethWithdraw = wethTransactionData.result
      .filter((item: ScanTransaction) => item.from.toLowerCase() === tokenBoundAccount.toLowerCase())
      .map((transaction: ScanTransaction) => {
        const value = BigNumber.from(transaction.value)
        const decimals = BigNumber.from(transaction.tokenDecimal)
        return {
          isSuccess: true,
          hash: transaction.hash,
          value: utils.formatUnits(value, decimals),
          timestamp: parseInt(transaction.timeStamp) * 1000,
          type: 'Withdraw',
          currency: transaction.tokenSymbol,
        }
      })

    const result = [...usdcDeposit, ...usdcWithdraw, ...wethWithdraw].sort(
      (a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', detail: error }, { status: 500 })
  }
}
