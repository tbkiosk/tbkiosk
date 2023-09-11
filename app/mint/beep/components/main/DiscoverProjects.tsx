import { Box, Center, Group, Image, Loader, Text } from '@mantine/core'
import classes from 'app/mint/beep/components/main/styles.module.css'
import { useQuery } from '@tanstack/react-query'
import { Project } from '@prisma/client'
import { match } from 'ts-pattern'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import Link from 'next/link'
import { useState } from 'react'
import { cx } from 'classix'

type ProjectCardProps = {
  slug: string
  image: string
  name: string
  logo: string
}
const ProjectCard = ({ slug, image, name, logo }: ProjectCardProps) => {
  return (
    <Link href={`/projects/${slug}`}>
      <Box>
        <Image
          src={image}
          alt={name}
          w={'100%'}
          h={224}
          radius={10}
        />
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
      </Box>
    </Link>
  )
}

type SlideNavButtonProps = {
  isNext: boolean
  disabled: boolean
}

export const SlideNavButton = ({ isNext, disabled }: SlideNavButtonProps) => {
  const swiper = useSwiper()
  const handleSlide = () => {
    return isNext ? swiper.slideNext() : swiper.slidePrev()
  }
  if (disabled) return null

  return (
    <Box className={cx(classes['discover-project-nav-container'], !isNext && classes['discover-project-nav-container__prev'])}>
      <Box
        className={classes['discover-project-nav-button']}
        onClick={handleSlide}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={!isNext ? classes['discover-project-svg-rotate'] : ''}
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>
    </Box>
  )
}

export const DiscoverProjects = () => {
  const [isEnd, setIsEnd] = useState(false)
  const [isBeginning, setIsBeginning] = useState(false)

  const { data: projects, status } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/parallel/relatives`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return await res.json()
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
            draggable={false}
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
            allowTouchMove={false}
            onSlideChange={swiper => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            onInit={swiper => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            style={{
              position: 'relative',
            }}
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
            <SlideNavButton
              isNext={true}
              disabled={isEnd}
            />
            <SlideNavButton
              isNext={false}
              disabled={isBeginning}
            />
          </Swiper>
        ))
        .with('error', () => <Text>Failed to load projects</Text>)
        .exhaustive()}
    </Box>
  )
}
