import { NextResponse } from 'next/server'

export const runtime = 'edge'

export type UpdateStatusPayload = {
  ID: string
  SIGNATURE?: string
  OWNER_ADDRESS?: string
  IS_ACTIVE: boolean
}

export async function PUT(request: Request, { params }: { params: { tokenBoundAccount: string } }) {
  const tokenBoundAccount = params.tokenBoundAccount
  const { IS_ACTIVE } = (await request.json()) as UpdateStatusPayload

  const res = await fetch(`https://ceqrnop0wl.execute-api.us-east-1.amazonaws.com/default/aws-serverless-typescript-api-dev-updateStatus`, {
    method: 'POST',
    body: JSON.stringify({
      ID: tokenBoundAccount,
      IS_ACTIVE,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: res.statusText }, { status: res.status })
  }

  const response = await res.json()

  if (!response?.user) {
    return NextResponse.json({ error: response.statusText || response.message }, { status: response.status || 400 })
  }

  return NextResponse.json(response)
}
