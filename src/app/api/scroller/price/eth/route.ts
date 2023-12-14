import { NextResponse } from 'next/server'
import { env } from 'env.mjs'

export async function GET() {
  try {
    let res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&x_cg_demo_api_key=${env.COIN_GECKO_KEY}`
    )

    if (!res.ok) {
      throw new Error(res.statusText)
    }

    res = await res.json()

    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
