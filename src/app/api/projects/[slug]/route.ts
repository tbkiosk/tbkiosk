import { NextResponse } from 'next/server'

import { prismaClient } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET(request: Request, context: { params: { slug: string } }) {
  const project = await prismaClient.project.findFirst({
    where: {
      slug: context.params.slug,
    },
  })

  return NextResponse.json(project)
}
