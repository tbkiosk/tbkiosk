import dayjs from 'dayjs'

import { prismaClient } from '@/lib/prisma'

import type { TBAUser } from '@prisma/client'

export const swapSingleUser = async (user: TBAUser) => {
  const userToUpdate = await prismaClient.tBAUser.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!userToUpdate) {
    throw new Error('User not found')
  }

  // TODO: swap logic
  // const alchemyProvider = new ethers.providers.JsonRpcProvider(ALCHEMY_PROVIDER_API_URL_MAP[env.NEXT_PUBLIC_CHAIN_ID])
  // const signer = new ethers.Wallet(env.PRIVATE_KEY, alchemyProvider)
  // const beepContract = new ethers.Contract(env.NEXT_PUBLIC_BEEP_CONTRACT_ADDRESS, BEEP_API, signer)

  // const gasPrice = await alchemyProvider.getGasPrice()

  // const tx = await beepContract.swapExactInputSingle(
  //   user.token_address_from, //tokenIn
  //   user.token_address_to, //tokenOut
  //   user.amount,
  //   4000000, //gasFee
  //   1000000, //beepFee
  //   {
  //     gasPrice: gasPrice,
  //     gasLimit: 500000,
  //   }
  // )

  // console.log(tx)

  const updatedTbaUser = await prismaClient.tBAUser.update({
    where: {
      id: user.id,
    },
    data: {
      last_swap: userToUpdate.next_swap,
      next_swap: dayjs(userToUpdate.next_swap).add(userToUpdate.frequency, 'days').toDate(),
    },
  })

  return updatedTbaUser
}
