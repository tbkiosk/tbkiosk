'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Spinner } from '@nextui-org/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import ProjectCard from './project_card'

import { CATEGORY_TYPE_ALL } from '@/app/projects/components/filters'

import type { Project } from '@prisma/client'

/**
 * there will 1, 2, 3, 4 and 6 columns by window width
 * set limit 12 to fill the last row
 */
const LIMIT = 12

const ProjectsGrid = () => {
  const searchParams = useSearchParams()

  const categories = searchParams.get('categories') || CATEGORY_TYPE_ALL

  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<{
    data: Project[]
    metaData: {
      cursor: string | null
      hasNextPage: boolean
    }
  }>({
    queryKey: ['projects', categories],
    queryFn: async ({ pageParam = '' }) => {
      const res = await fetch(`/api/projects?limit=${LIMIT}&categories=${categories}&cursor=${pageParam}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const data = await res.json()

      return data
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => (lastPage?.metaData.hasNextPage ? lastPage?.metaData.cursor : undefined),
    staleTime: Infinity,
  })

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load projects')
    }
  }, [error])

  return (
    <div className="min-h-[240px] flex flex-col items-center justify-center">
      {isLoading && (
        <Spinner
          classNames={{ circle1: 'border-b-[#5c5f66]', circle2: 'border-b-[#5c5f66]' }}
          size="lg"
        />
      )}
      {data && (
        <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.pages.map(_page =>
            _page.data.map(_proj => (
              <ProjectCard
                key={_proj.slug}
                project={_proj}
              />
            ))
          )}
        </div>
      )}
      {data && hasNextPage && (
        <Button
          className="mt-8 tracking-[4px]"
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          variant="light"
        >
          LOAD MORE
        </Button>
      )}
      {data && !hasNextPage && <p className="mt-8 tracking-[4px]">NO MORE PROJECTS</p>}
    </div>
  )
}

export default ProjectsGrid
