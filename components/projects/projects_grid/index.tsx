import { useRouter } from 'next/navigation'
import { Grid, LoadingOverlay, Center, Title } from '@mantine/core'

import ProjectCard from '../project_card'

import classes from './styles.module.css'

import type { Project } from '@prisma/client'

type ProjectsGridProps = {
  projects: Project[] | undefined
  loading: boolean
}

export default function ProjectsGrid({ projects, loading }: ProjectsGridProps) {
  const router = useRouter()

  return (
    <Grid
      className={classes.grid}
      gutter="lg"
    >
      <LoadingOverlay
        overlayProps={{ backgroundOpacity: 0 }}
        visible={loading}
      />
      {projects?.map(_project => (
        <Grid.Col
          key={_project.id}
          onClick={() => router.push(`/projects/${_project.slug}`)}
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
