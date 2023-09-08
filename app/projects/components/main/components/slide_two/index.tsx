import { useMemo, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Box, Title, Text, AspectRatio, Button, Image } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'
import dayjs from 'dayjs'

import Footer from 'components/footer'
import ProjectsGrid from 'components/projects/projects_grid'
import Filters from './components/filters'
import LogoText from 'public/logo-text.svg'

import { CATEGORY_TYPE_ALL, CATEGORY_TYPE_NEW } from './components/filters'

import classes from './styles.module.css'

import type { Project, Category } from '@prisma/client'

export default function SlideTwo() {
  const searchParams = useSearchParams()
  const categories = searchParams.get('categories') || CATEGORY_TYPE_ALL

  const projectsContainerRef = useRef<HTMLDivElement | null>(null)

  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => {
      projectsContainerRef.current?.scrollTop === 0 && eventData.deltaY > 50 && onPrevSlide()
    },
  })

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`/api/projects`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  const refPassthrough = (el: HTMLDivElement) => {
    handlers.ref(el)
    projectsContainerRef.current = el
  }

  const onPrevSlide = () => slide.isActive && !swiper.destroyed && swiper?.slidePrev()

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (projectsContainerRef.current?.scrollTop !== 0) return

    e.deltaY < 0 && onPrevSlide()
  }

  const filteredProjects = useMemo(() => {
    if (!categories || categories === CATEGORY_TYPE_ALL) return projects || []

    if (categories === CATEGORY_TYPE_NEW) {
      return projects?.filter(_p => dayjs().diff(dayjs(_p.createdAt), 'day') <= 15) || []
    }

    return projects?.filter(_p => _p.categories.includes(categories as Category)) || []
  }, [categories, projects])

  useEffect(() => {
    if (error) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: (error as Error)?.message,
      })
    }
  }, [error])

  return (
    <Box
      className={classes.container}
      onWheel={onWheel}
      {...handlers}
      ref={refPassthrough}
    >
      <Box className={classes['mint-beep-container']}>
        <AspectRatio
          className={classes['mint-beep-image-container']}
          maw={500}
          ratio={1}
          w="100%"
        >
          <Image
            alt="beep"
            className={classes['beep-image']}
            src="/beep-poster.png"
          />
        </AspectRatio>
        <Box className={classes['mint-beep-description-col']}>
          <Text className={classes['mint-beep-creator']}>
            <span>Created by</span>
            <span className={classes['logo-text']}>
              <LogoText />
            </span>
          </Text>
          <Text className={classes['mint-beep-title']}>BEEP BOT</Text>
          <Text className={classes['mint-beep-coming-soon']}>Coming soon</Text>
          <Text className={classes['mint-beep-text']}>
            Beep is a Dollar-cost averaging (DCA) bot with a token-bound account.
            <br />
            <br />
            In a volatile market, Beep is your reliable companion, helping you navigate fluctuations by strategically spreading your
            purchases across different price levels.
          </Text>
          <Box className={classes['mint-beep-link-container']}>
            <Button
              component="a"
              className={classes['mint-beep-link']}
              color="rgba(0, 0, 0, 1)"
              href="https://forms.gle/4XCifz7YWuNppNHd6"
              radius="xl"
              rel="noreferrer"
              size="lg"
              target="_blank"
              variant="filled"
            >
              Join waitlist
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className={classes.wrapper}>
        <Title
          className={classes.title}
          order={4}
        >
          LATEST PROJECTS
        </Title>
        <Filters />
        <Box className={classes['projects-container']}>
          <ProjectsGrid
            loading={isLoading}
            projects={filteredProjects}
          />
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}
