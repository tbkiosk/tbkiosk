import { expect, test } from 'vitest'
import { Utils } from 'alchemy-sdk'

import { swapSingleUser, batchSwap } from './admin_swap'

test('Single swap should fail if TBA address is invalid', async () => {
  const tx = await swapSingleUser({
    swapContract: '0x000000000000000000000000000000000000dead',
    tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenOut: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
    amountIn: 20,
    beepFee: Utils.parseUnits('1', 6),
    gasFee: Utils.parseUnits('1', 6),
  })

  expect(tx).toBe(null)
})

test('Batch swap should fail if TBA address is invalid', async () => {
  const tx = await batchSwap([
    {
      swapContract: '0x000000000000000000000000000000000000dead',
      tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      amountIn: 100,
      beepFee: Utils.parseUnits('30', 6),
      gasFee: Utils.parseUnits('20', 6),
    },
    {
      swapContract: '0x000000000000000000000000000000000000dead',
      tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
      amountIn: 50,
      beepFee: Utils.parseUnits('10', 6),
      gasFee: Utils.parseUnits('2', 6),
    },
  ])

  expect(tx).toBe(null)
})
