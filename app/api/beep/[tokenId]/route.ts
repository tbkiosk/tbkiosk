import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  const tokenId = params.tokenId

  const res = await fetch(`https://unitba-249bfef801d8.herokuapp.com/api/meta/${tokenId}`)

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const meta = await res.json()

  return NextResponse.json(meta)
}
