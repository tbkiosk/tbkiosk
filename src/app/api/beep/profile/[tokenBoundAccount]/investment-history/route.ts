import { NextResponse } from 'next/server'
import { decodeFunctionData } from 'viem'

import { env } from 'env.mjs'

export const runtime = 'edge'

type Transaction = {
  blockNumber: string
  blockHash: string
  timeStamp: string
  hash: string
  nonce: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  input: string
  methodId: string
  functionName: string
  contractAddress: string
  cumulativeGasUsed: string
  txreceipt_status: string
  gasUsed: string
  confirmations: string
  isError: string
}

export type SwapTransaction = {
  isSuccess: boolean
  hash: string
  value: string
  timestamp: number
}

const getSwapValue = (data: `0x${string}`) => {
  const { args } = decodeFunctionData({
    abi: [
      {
        constant: false,
        inputs: [
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'amountIn',
            type: 'uint256',
          },
          {
            name: 'bizId',
            type: 'uint256',
          },
          {
            name: 'amountOutMinimum',
            type: 'uint256',
          },
        ],
        name: 'swapExactInputSingle',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    data: data,
  })
  return args[1].toString()
}

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const key = env.POLYGONSCAN_KEY

    const response = await fetch(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${tokenBoundAccount}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${key}`
    )

    const { result } = (await response.json()) as { result: Transaction[] }

    const swapTransactions = result.filter(
      item => item.functionName === 'swapExactInputSingle(address receiver,uint256 amountIn,uint256 bizId,uint256 amountOutMinimum)'
    )

    const data = swapTransactions.map(item => {
      return {
        isSuccess: item.isError === '0',
        hash: item.hash,
        value: getSwapValue(item.input as `0x${string}`),
        timestamp: parseInt(item.timeStamp) * 1000,
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', detail: error }, { status: 500 })
  }
}
