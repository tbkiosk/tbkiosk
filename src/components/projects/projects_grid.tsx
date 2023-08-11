import { Grid, LoadingOverlay, rem } from '@mantine/core'

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
    </Grid>
  )
}

export default ProjectsGrid
