import { NextResponse } from 'next/server'

import { prismaClient } from 'lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const limit = searchParams.get('limit')

  const projects = await prismaClient.project.findMany({
    where: {
      status: 'Published',
      OR: [{ name: { contains: search || '' } }],
    },
    take: limit ? +limit : undefined,
  })

  return NextResponse.json(projects)
}
