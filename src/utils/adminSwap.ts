import { env } from '../../env.mjs'
import { Alchemy, Network, Utils, Wallet, BigNumber } from 'alchemy-sdk'
import { abi } from '@/utils/adminAbi'

type SwapDetail = {
  swapContract: string // TBA address
  tokenIn: string
  tokenOut: string
  amountIn: BigNumber // should include decimals
  gasFee: BigNumber // should include decimals
  beepFee: BigNumber // should include decimals
}

const settings = {
  apiKey: env.ALCHEMY_KEY,
  network: Network.ETH_GOERLI,
}

const alchemy = new Alchemy(settings)
const adminContract = env.NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS
const chainId = env.NEXT_PUBLIC_CHAIN_ID
const privateKey = '' //This should be the bot account that is used to call the admin contract

export const swapSingleUser = async ({ swapContract, beepFee, gasFee, tokenOut, tokenIn, amountIn }: SwapDetail) => {
  const wallet = new Wallet(privateKey, alchemy)
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
  const wallet = new Wallet(privateKey, alchemy)
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
