import { Grid, LoadingOverlay, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'

import ProjectCard from './project_card'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

type ProjectsGridProps = {
  limit?: number
  pageSize?: number
  pageNumber?: number
  replace?: boolean
}

const ProjectsGrid = ({ limit, pageNumber, pageSize, replace = false }: ProjectsGridProps) => {
  const { data, isLoading } = useQuery<Project[], Error>({
    queryKey: ['discover'],
    queryFn: async () => {
      const { data, error } = await request<Project[], string>({
        url: '/api/discover',
        params: {
          limit,
          pageNumber,
          pageSize,
        },
      })

      if (error) {
        throw new Error(error)
      }

      return data || []
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message,
        title: 'Error',
        withCloseButton: true,
      })
    },
    retry: false,
    refetchOnWindowFocus: false,
  })

  return (
    <Grid
      gutter="xl"
      maw={rem(1440)}
      mb={rem(48)}
      pos="relative"
    >
      <LoadingOverlay visible={isLoading} />
      {data?.map(_project => (
        <Grid.Col
          key={_project.id}
          md={3}
          sm={4}
          xs={6}
        >
          <ProjectCard
            {..._project}
            replace={replace}
          />
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default ProjectsGrid
