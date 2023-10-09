import { prismaClient } from '@/lib/prisma'

import ProjectCard from '@/components/projects_grid/project_card'

import type { Project } from '@prisma/client'

const DEFAULT_RECOMMENDATIONS = 6

const getRecommendationProjects = async (slug: string): Promise<Project[] | null> => {
  const target = await prismaClient.project.findFirst({
    where: { slug },
  })

  if (!target) return []

  return await prismaClient.project.findMany({
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
}

const ProjectRecommendation = async ({ slug }: { slug: string }) => {
  const recommendationProjects = await getRecommendationProjects(slug)

  if (!recommendationProjects?.length) return null

  return (
    <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recommendationProjects.map(_proj => (
        <ProjectCard
          key={_proj.slug}
          project={_proj}
        />
      ))}
    </div>
  )
}

export default ProjectRecommendation
