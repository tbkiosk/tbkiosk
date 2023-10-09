import { NextResponse } from 'next/server'

import { prismaClient } from '@/lib/prisma'

const DEFAULT_RECOMMENDATIONS = 6

export const runtime = 'nodejs'

export async function GET(request: Request, context: { params: { slug: string } }) {
  const target = await prismaClient.project.findFirst({
    where: { slug: context.params.slug },
  })

  if (!target) return NextResponse.json([])

  const projects = await prismaClient.project.findMany({
    where: {
      id: {
        not: {
          equals: target.id,
        },
      },
      OR: [
        {
          categories: {
            hasSome: target.categories,
          },
          blockchains: {
            hasSome: target.blockchains,
          },
        },
      ],
    },
    take: DEFAULT_RECOMMENDATIONS,
  })

  return NextResponse.json(projects)
}
