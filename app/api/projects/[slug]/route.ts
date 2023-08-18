import { NextResponse } from 'next/server'

// import { prismaClient } from 'lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request, context: { params: { slug: string } }) {
  return NextResponse.json({ slug: context.params.slug })
}
