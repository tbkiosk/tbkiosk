import { NextResponse } from 'next/server'

import { prismaClient } from 'lib/prisma'

const DEFAULT_RECOMMENDATIONS = 6

export const runtime = 'nodejs'

export async function GET(request: Request, context: { params: { slug: string } }) {
  const currentProject = await prismaClient.project.findFirst({
    where: { slug: context.params.slug },
  })

  if (!currentProject) return []

  const projects = await prismaClient.project.findMany({
    where: {
      id: {
        not: {
          equals: currentProject.id,
        },
      },
      OR: [
        {
          categories: {
            hasSome: currentProject.categories,
          },
          blockchains: {
            hasSome: currentProject.blockchains,
          },
        },
      ],
    },
    take: DEFAULT_RECOMMENDATIONS,
  })

  return NextResponse.json(projects)
}
