import { Grid, LoadingOverlay, Center, Title } from '@mantine/core'

import ProjectCard from '../project_card'

import classes from './index.module.css'

import type { Project } from '@prisma/client'

type ProjectsGridProps = {
  projects: Project[] | undefined
  loading: boolean
}

export default function ProjectsGrid({ projects, loading }: ProjectsGridProps) {
  return (
    <Grid
      className={classes.grid}
      gutter="lg"
      maw={1440}
      mb={48}
    >
      <LoadingOverlay visible={loading} />
      {projects?.map(_project => (
        <Grid.Col
          key={_project.id}
          span={{ base: 12, lg: 3, sm: 4, xs: 6 }}
        >
          <ProjectCard {..._project} />
        </Grid.Col>
      ))}
      {!projects?.length && !loading && (
        <Grid.Col
          h="100%"
          span={12}
        >
          <Center h="100%">
            <Title c="gray">No projects</Title>
          </Center>
        </Grid.Col>
      )}
    </Grid>
  )
}