import { NextResponse } from 'next/server'

import { prismaClient } from 'lib/prisma'
import { Category } from '@prisma/client'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const categories = searchParams.getAll('categories')
  const limit = searchParams.get('limit')

  const projects = await prismaClient.project.findMany({
    where: {
      status: 'Published',
      AND: [
        ...(search ? [{ name: { contains: search } }] : []),
        ...(categories.length ? [{ categories: { hasSome: categories as Category[] } }] : []),
      ],
    },
    take: limit ? +limit : undefined,
  })

  return NextResponse.json(projects)
}
