import { NextResponse } from 'next/server'
import { env } from '../../../../../../../env.mjs'
import { decodeFunctionData } from 'viem'

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
            name: 'amountIn',
            type: 'uint256',
          },
        ],
        name: 'swapExactInputSingle',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    data: data,
  })
  return args[0].toString()
}

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  try {
    const key = env.ETHERSCAN_KEY

    const response = await fetch(
      `https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${tokenBoundAccount}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${key}`
    )

    const { result } = (await response.json()) as { result: Transaction[] }

    const swapTransactions = result.filter(item => item.functionName === 'swapExactInputSingle(uint256 amountIn)')

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
