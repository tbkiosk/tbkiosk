import { Grid, LoadingOverlay, Center, Title, rem } from '@mantine/core'

import ProjectCard from './project_card'

import type { Project } from '@prisma/client'

type ProjectsGridProps = {
  projects: Project[] | undefined
  isLoading: boolean
  replace?: boolean
}

const ProjectsGrid = ({ projects, isLoading, replace = false }: ProjectsGridProps) => {
  return (
    <Grid
      gutter="xl"
      maw={rem(1440)}
      mb={rem(48)}
      pos="relative"
      style={{ flex: 1 }}
    >
      <LoadingOverlay visible={isLoading} />
      {projects?.map(_project => (
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
      {!projects?.length && !isLoading && (
        <Grid.Col
          h="100%"
          span={12}
        >
          <Center h="100%">
            <Title color="gray">No projects</Title>
          </Center>
        </Grid.Col>
      )}
    </Grid>
  )
}

export default ProjectsGrid
