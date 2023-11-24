/* eslint-disable no-console */

import { Utils, Wallet, BigNumber } from 'alchemy-sdk'
import { decodeErrorResult } from 'viem/utils'
import dayjs from 'dayjs'

import { abi } from '@/utils/admin_abi'
import { TOKENS_FROM } from '@/constants/token'

import { prismaClient } from '@/lib/prisma'
import { alchemy } from '@/lib/alchemy'

import { env } from 'env.mjs'

type SwapDetail = {
  swapContract: string // TBA address
  tokenIn: string // usdc or usdt
  tokenOut: string // erc20 token
  amountIn: number
  gasFee: BigNumber // should include decimals
  beepFee: BigNumber // should include decimals
  nonce?: number
}

const adminContract = env.NEXT_PUBLIC_ADMIN_CONTRACT_ADDRESS
const chainId = env.NEXT_PUBLIC_CHAIN_ID

export const swapSingleUser = async ({ swapContract, beepFee, gasFee, tokenOut, tokenIn, amountIn, nonce }: SwapDetail) => {
  try {
    const wallet = new Wallet(env.SWAP_PRIVATE_KEY, alchemy)
    const feeData = await alchemy.core.getFeeData()

    const adminInterface = new Utils.Interface(abi)
    const data = adminInterface.encodeFunctionData('swap', [
      swapContract,
      tokenIn,
      tokenOut,
      Utils.parseUnits(String(amountIn), TOKENS_FROM[tokenIn].decimal),
      gasFee,
      beepFee,
    ])

    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) {
      throw new Error('Fee data not found')
    }

    const transaction = {
      to: adminContract,
      nonce: nonce || (await alchemy.core.getTransactionCount(wallet.getAddress())),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      type: 2,
      chainId: parseInt(chainId),
      data: data,
      gasLimit: Utils.parseUnits('250000', 'wei'),
    }

    const hex = await wallet.call(transaction)
    const error = getTransactionError(hex as `0x${string}`)

    if (error) {
      await prismaClient.swapHistory.create({
        data: {
          address: swapContract,
          token_address_from: tokenIn,
          token_address_to: tokenOut,
          amount: amountIn,
          date: dayjs().toISOString(),
          success: false,
          reason: error,
        },
      })

      return null
    }

    const tx = await wallet.sendTransaction(transaction)

    await prismaClient.swapHistory.create({
      data: {
        address: swapContract,
        token_address_from: tokenIn,
        token_address_to: tokenOut,
        amount: amountIn,
        date: dayjs().toISOString(),
        success: true,
        tx: tx.hash,
      },
    })

    return tx
  } catch (error) {
    const message = (error as Error & { reason?: string })?.reason || (error as Error)?.message || 'unknown error'

    console.error(message)

    await prismaClient.swapHistory.create({
      data: {
        address: swapContract,
        token_address_from: tokenIn,
        token_address_to: tokenOut,
        amount: amountIn,
        date: dayjs().toISOString(),
        success: false,
        reason: message,
      },
    })

    return null
  }
}

export const batchSwap = async (swapDetails: SwapDetail[]) => {
  const wallet = new Wallet(env.SWAP_PRIVATE_KEY, alchemy)
  const feeData = await alchemy.core.getFeeData()

  const adminInterface = new Utils.Interface(abi)
  const data = adminInterface.encodeFunctionData('batchSwap', [
    swapDetails.map(_sd => ({ ..._sd, amountIn: Utils.parseUnits(String(_sd.amountIn), TOKENS_FROM[_sd.tokenIn].decimal) })),
  ])

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

  try {
    const hex = await wallet.call(transaction)
    const error = getTransactionError(hex as `0x${string}`)
    const now = dayjs().toISOString()

    if (error) {
      await prismaClient.swapHistory.createMany({
        data: swapDetails.map(_sd => ({
          address: _sd.swapContract,
          token_address_from: _sd.tokenIn,
          token_address_to: _sd.tokenOut,
          amount: _sd.amountIn,
          date: now,
          success: false,
          reason: error,
        })),
      })

      return null
    }

    const tx = await wallet.sendTransaction(transaction)

    await prismaClient.swapHistory.createMany({
      data: swapDetails.map(_sd => ({
        address: _sd.swapContract,
        token_address_from: _sd.tokenIn,
        token_address_to: _sd.tokenOut,
        amount: _sd.amountIn,
        date: now,
        success: true,
        tx: tx.hash,
      })),
    })

    return tx
  } catch (error) {
    console.error((error as Error & { reason?: string })?.reason)

    return null
  }
}

const getTransactionError = (resultHex: `0x${string}`) => {
  try {
    const errorResult = decodeErrorResult({
      abi: abi,
      data: resultHex,
    })

    return String(errorResult.args?.[0]) || errorResult.errorName || 'Error'
  } catch (error) {
    return null
  }
}
