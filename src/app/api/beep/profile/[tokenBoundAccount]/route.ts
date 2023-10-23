import { NextResponse } from 'next/server'

import { USDC_DECIMAL } from '@/constants/token'

import type { Profile } from '@/types/profile'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const res = await fetch(`https://kiwr7bffu9.execute-api.us-east-1.amazonaws.com/dev/profile/${tokenBoundAccount}`)

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status })
  }

  const profile: Profile = await res.json()

  return NextResponse.json({ ...profile, user: { ...profile.user, AMOUNT: profile.user.AMOUNT / 10 ** USDC_DECIMAL } })
}

export async function POST(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const res = await fetch(`https://ihmfatm2df.execute-api.us-east-1.amazonaws.com/default/aws-serverless-typescript-api-dev-createUser`, {
    method: 'POST',
    body: JSON.stringify({
      ID: tokenBoundAccount,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status })
  }

  const response = await res.json()

  if (response.status >= 400) {
    return NextResponse.json({ error: response.statusText }, { status: response.status })
  }

  return NextResponse.json(response)
}

export async function PUT(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount
  const { FREQUENCY, AMOUNT, END_DATE } = await request.json()

  const res = await fetch(
    `https://x7xo5ntbj4.execute-api.us-east-1.amazonaws.com/default/aws-serverless-typescript-api-dev-updateSettings`,
    {
      method: 'POST',
      body: JSON.stringify({
        ID: tokenBoundAccount,
        FREQUENCY: +FREQUENCY,
        AMOUNT: +AMOUNT * 10 ** USDC_DECIMAL,
        END_DATE: +END_DATE,
      }),
    }
  )

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status })
  }

  const response = await res.json()

  if (!response?.user) {
    return NextResponse.json({ error: response.statusText || response.message }, { status: response.status || 400 })
  }

  return NextResponse.json(response)
}
