/* eslint-disable no-console */

import { Utils } from 'alchemy-sdk'
import { NextResponse } from 'next/server'
// import dayjs from 'dayjs'

import { swapSingleUser } from '@/utils/admin_swap'

// import { prismaClient } from '@/lib/prisma'

export const runtime = 'nodejs'

// export async function GET() {
//   try {
//     const usersToSwap = await prismaClient.tBAUser.findMany({
//       where: {
//         next_swap: {
//           lte: dayjs().toDate(),
//         },
//         is_active: true,
//         OR: [
//           {
//             end_date: {
//               gte: dayjs().toDate(),
//             },
//           },
//           {
//             end_date: {
//               equals: null,
//             },
//           },
//         ],
//       },
//     })

//     const results = usersToSwap

//     console.log(results)
//     return NextResponse.json(results)
//   } catch (error) {
//     console.error(error)
//     return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
//   }
// }

export async function GET() {
  try {
    const result = await swapSingleUser({
      swapContract: '0xD913fB80c3E691c9A44d603e3190435F40823087',
      tokenIn: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
      tokenOut: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
      amountIn: Utils.parseUnits('200', 6),
      beepFee: Utils.parseUnits('40', 6),
      gasFee: Utils.parseUnits('20', 6),
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
