import { NextResponse } from 'next/server'
import { env } from 'env.mjs'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET() {
  try {
    const prediction = await fetch(env.SCROLLER_PREDICTION_URL)
    const response = await prediction.json()

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: (error as Error)?.message || 'Failed to get deposit transactions' }, { status: 500 })
  }
}
