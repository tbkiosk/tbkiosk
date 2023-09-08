import { Box, Center, Group, Image, Loader, Text } from '@mantine/core'
import classes from 'app/mint/beep/components/main/styles.module.css'
import { useQuery } from '@tanstack/react-query'
import { Project } from '@prisma/client'
import { match } from 'ts-pattern'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper/modules'
import Link from 'next/link'

type ProjectCardProps = {
  slug: string
  image: string
  name: string
  logo: string
}
const ProjectCard = ({ slug, image, name, logo }: ProjectCardProps) => {
  return (
    <Box>
      <Image
        src={image}
        alt={name}
        w={'100%'}
        h={224}
        radius={10}
      />
      <Link href={`/projects/${slug}`}>
        <Group
          gap={12}
          mt={16}
        >
          <Image
            src={logo}
            alt={name}
            h={32}
            w={32}
            radius={'xl'}
          />
          <Text className={classes['discover-project-card-name']}>{name}</Text>
        </Group>
      </Link>
    </Box>
  )
}

export const DiscoverProjects = () => {
  const { data: projects, status } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/parallel/relatives`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  return (
    <Box>
      <Text className={classes['discover-project-title']}>Discover More Projects</Text>
      {match(status)
        .with('loading', () => (
          <Center>
            <Loader
              type="dots"
              color={'dark'}
            />
          </Center>
        ))
        .with('success', () => (
          <Swiper
            slidesPerView={1}
            spaceBetween={4}
            pagination={{
              clickable: false,
              type: 'custom',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 6,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
              1440: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            modules={[Pagination, Navigation]}
          >
            {projects?.map(project => (
              <SwiperSlide key={project.id}>
                <ProjectCard
                  slug={project.slug}
                  image={project.bannerImage}
                  name={project.name}
                  logo={project.logoUrl}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ))
        .with('error', () => <Text>Failed to load projects</Text>)
        .exhaustive()}
    </Box>
  )
}
