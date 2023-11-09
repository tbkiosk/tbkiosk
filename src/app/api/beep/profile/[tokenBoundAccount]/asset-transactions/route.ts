import { NextResponse } from 'next/server'
import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk'
import { utils, BigNumber } from 'ethers'

import { ALCHEMY_CONFIG } from '@/constants/alchemy'
import { explorer } from '@/constants/explorer'

import { env } from 'env.mjs'

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

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const alchemy = new Alchemy(ALCHEMY_CONFIG)

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

    const wethContract = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
    const feeWallet = '0x88f92ba0D9E7C91F5B67A9B31c4Fe917141447AF'
    const usdcWethPoolContract = '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8'

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
        if (transfer.to?.toLowerCase() === feeWallet.toLowerCase()) return false
        else if (transfer.asset !== 'USDC') return false
        else return transfer.to?.toLowerCase() !== usdcWethPoolContract.toLowerCase()
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

    const key = env.ETHERSCAN_KEY
    const wethTransactionResponse = await fetch(
      `${
        explorer[env.NEXT_PUBLIC_CHAIN_ID]
      }/api?module=account&action=tokentx&contractaddress=${wethContract}&address=${tokenBoundAccount}&page=1&offset=500&startblock=0&endblock=99999999&sort=asc&apikey=${key}`
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
