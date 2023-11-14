import { Alchemy, Utils, Wallet, BigNumber } from 'alchemy-sdk'

import { abi } from '@/utils/admin_abi'
import { ALCHEMY_CONFIG } from '@/constants/alchemy'

import { env } from 'env.mjs'

type SwapDetail = {
  swapContract: string // TBA address
  tokenIn: string // erc20 token
  tokenOut: string // usdc or usdt
  amountIn: BigNumber // should include decimals
  gasFee: BigNumber // should include decimals
  beepFee: BigNumber // should include decimals
}

const alchemy = new Alchemy(ALCHEMY_CONFIG)
const adminContract = env.NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS
const chainId = env.NEXT_PUBLIC_CHAIN_ID

export const swapSingleUser = async ({ swapContract, beepFee, gasFee, tokenOut, tokenIn, amountIn }: SwapDetail) => {
  const wallet = new Wallet(env.SWAP_PRIVATE_KEY, alchemy)
  const feeData = await alchemy.core.getFeeData()

  const adminInterface = new Utils.Interface(abi)
  const data = adminInterface.encodeFunctionData('swap', [swapContract, tokenIn, tokenOut, amountIn, gasFee, beepFee])

  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    throw new Error('Fee data not found')
  }

  const transaction = {
    to: adminContract,
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
    chainId: parseInt(chainId),
    data: data,
    gasLimit: Utils.parseUnits('250000', 'wei'),
  }

  return await wallet.sendTransaction(transaction)
}

export const batchSwap = async (swapDetails: SwapDetail[]) => {
  const wallet = new Wallet(env.SWAP_PRIVATE_KEY, alchemy)
  const feeData = await alchemy.core.getFeeData()

  const adminInterface = new Utils.Interface(abi)
  const data = adminInterface.encodeFunctionData('batchSwap', [swapDetails])

  if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
    throw new Error('Fee data not found')
  }

  const transaction = {
    to: adminContract,
    nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    maxFeePerGas: feeData.maxFeePerGas,
    type: 2,
    chainId: parseInt(chainId),
    data: data,
    gasLimit: Utils.parseUnits('250000', 'wei'),
  }

  return await wallet.sendTransaction(transaction)
}

// swapSingleUser({
//   swapContract: '0xD913fB80c3E691c9A44d603e3190435F40823087', // TBA address
//   tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
//   tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//   amountIn: Utils.parseUnits('200', 6),
//   beepFee: Utils.parseUnits('40', 6),
//   gasFee: Utils.parseUnits('20', 6),
// })

// batchSwap([
//   {
//     swapContract: '0xD913fB80c3E691c9A44d603e3190435F40823087', // TBA address
//     tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
//     tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//     amountIn: Utils.parseUnits('100', 6),
//     beepFee: Utils.parseUnits('30', 6),
//     gasFee: Utils.parseUnits('20', 6),
//   },
//   {
//     swapContract: '0xD913fB80c3E691c9A44d603e3190435F40823087', // TBA address
//     tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
//     tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
//     amountIn: Utils.parseUnits('50', 6),
//     beepFee: Utils.parseUnits('10', 6),
//     gasFee: Utils.parseUnits('2', 6),
//   },
// ])
