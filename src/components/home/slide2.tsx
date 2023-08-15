import { useRef } from 'react'
import { Container, Title, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import { useSwiper } from 'swiper/react'

import { Footer, ProjectsGrid } from '@/components'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

const Slide2 = () => {
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  const swiper = useSwiper()

  const largeScreen = useMediaQuery('(min-width: 48em)')

  const { data, isLoading } = useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await request<Project[], string>({
        url: '/api/projects',
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

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (projectsContainerRef.current?.scrollTop !== 0) return

    e.deltaY < 0 && !swiper.destroyed && swiper?.slidePrev()
  }

  return (
    <Container
      fluid
      h="100%"
      ref={projectsContainerRef}
      onWheel={onWheel}
      pos="relative"
      px={largeScreen ? rem(64) : 'lg'}
      py="lg"
      style={{ overflowY: 'auto', zIndex: 1200 }}
      sx={theme => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : '#fff' })}
    >
      <Container
        h="100%"
        maw={1440}
        px={0}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <Title
          order={4}
          py={rem(32)}
        >
          LATEST PROJECTS
        </Title>
        <ProjectsGrid
          isLoading={isLoading}
          projects={data}
        />
        <Footer />
      </Container>
    </Container>
  )
}

export default Slide2
