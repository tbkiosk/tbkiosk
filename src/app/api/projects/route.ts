import { NextResponse } from 'next/server'
import dayjs from 'dayjs'

import { prismaClient } from '@/lib/prisma'
import { Category, Prisma } from '@prisma/client'

import { CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW } from '@/app/projects/components/filters'

export const runtime = 'nodejs'

const DEFAULT_PAGE_SIZE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const categories = searchParams.get('categories') || CATEGORY_TYPE_ALL
  const limit = searchParams.get('limit')
  const cursor = searchParams.get('cursor')

  try {
    const projects = await prismaClient.project.findMany({
      where: {
        status: 'Published',
        AND: [
          ...(search ? [{ name: { contains: search, mode: Prisma.QueryMode.insensitive } }] : []),
          ...(categories === CATEGORY_TYPE_ALL || categories === CATEGORY_TYPE_NEW
            ? []
            : [{ categories: { hasSome: [categories] as Category[] } }]),
          ...(categories === CATEGORY_TYPE_NEW ? [{ createdAt: { gte: dayjs().subtract(15, 'day').toISOString() } }] : []),
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit ? +limit : DEFAULT_PAGE_SIZE,
      ...(cursor && {
        skip: 1,
        cursor: {
          id: cursor,
        },
      }),
    })

    if (projects.length < 1) {
      return NextResponse.json({ data: projects, metaData: { cursor: null, hasNextPage: false } })
    }

    const [lastProject] = projects.slice(-1)
    const lastProjectId = lastProject.id

    const nextPage = await prismaClient.project.findMany({
      where: {
        status: 'Published',
        AND: [
          ...(search ? [{ name: { contains: search, mode: Prisma.QueryMode.insensitive } }] : []),
          ...(categories === CATEGORY_TYPE_ALL || categories === CATEGORY_TYPE_NEW
            ? []
            : [{ categories: { hasSome: [categories] as Category[] } }]),
          ...(categories === CATEGORY_TYPE_NEW ? [{ createdAt: { gte: dayjs().subtract(15, 'day').toISOString() } }] : []),
        ],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit ? +limit : DEFAULT_PAGE_SIZE,
      skip: 1,
      cursor: {
        id: lastProjectId,
      },
    })

    return NextResponse.json({ data: projects, metaData: { cursor: lastProjectId, hasNextPage: nextPage.length > 0 } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
