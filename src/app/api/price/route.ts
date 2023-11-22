import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

import { env } from 'env.mjs'

export type TokenPriceNowAndHistory = [number | null, number | null] // [priceOfNow, priceOfHistory]

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const timestamp = searchParams.get('timestamp')
  const currency = searchParams.get('currency') || 'usd'

  if (!token) {
    return NextResponse.json({ error: 'Missing token in search params' }, { status: 400 })
  }

  const diffInDays = dayjs().diff(Number(timestamp), 'days')
  if (isNaN(diffInDays)) {
    return NextResponse.json({ error: 'Invalid timestamp' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${token}/market_chart?days=${diffInDays}&vs_currency=${currency}&x_cg_demo_api_key=${env.COIN_GECKO_KEY}`
    )

    if (!res.ok) {
      throw new Error(res.statusText)
    }

    const data: { prices: [number, number][] } = await res.json()
    const pricesMatrix = data.prices
    const priceNow = pricesMatrix?.[pricesMatrix.length - 1]?.[1] ?? null
    const priceHistorical = pricesMatrix?.[0]?.[1] ?? null

    return NextResponse.json([priceNow, priceHistorical])
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message }, { status: 500 })
  }
}
