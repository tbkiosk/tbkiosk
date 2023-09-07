import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount

  const res = await fetch(`https://kiwr7bffu9.execute-api.us-east-1.amazonaws.com/dev/profile/${tokenBoundAccount}`)

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const profile = await res.json()

  return NextResponse.json(profile)
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
    throw new Error(res.statusText)
  }

  const response: { statusCode: number; body: string } = await res.json()

  return NextResponse.json(response)
}
