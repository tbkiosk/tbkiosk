import { NextResponse } from 'next/server'
import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { env } from 'env.mjs'

const schema = z.object({
  email: z.string().email(),
  tbaAddress: z.string().startsWith('0x'),
})

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json()
  const validation = schema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ error: fromZodError(validation.error).details }, { status: 400 })
  }

  try {
    await fetch(env.EMAIL_DATABASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validation.data.email,
        tbaAddress: validation.data.tbaAddress,
      }),
    })

    return NextResponse.json({
      message: 'Email added to database',
      email: validation.data.email,
      tbaAddress: validation.data.tbaAddress,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: (error as Error)?.message || 'An error occurred' }, { status: 500 })
  }
}
