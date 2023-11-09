import { swapSingleUser } from '@/utils/adminSwap'
import { Utils } from 'alchemy-sdk'
import { NextResponse } from 'next/server'

export async function GET() {
  const txResponse = await swapSingleUser({
    swapContract: '0xD913fB80c3E691c9A44d603e3190435F40823087', // TBA address
    tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
    tokenOut: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    amountIn: Utils.parseUnits('200', 6),
    beepFee: Utils.parseUnits('40', 6),
    gasFee: Utils.parseUnits('20', 6),
  })
  return NextResponse.json({
    hash: txResponse.hash,
  })
}
