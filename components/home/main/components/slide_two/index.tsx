import { useRef } from 'react'
import { Box, Title } from '@mantine/core'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import Footer from 'components/home/footer'
import ProjectsGrid from 'components/projects/projects_grid'
import Filters from './components/filters'

import useProjects from 'hooks/use_projects'

import classes from './index.module.css'

export default function SlideTwo() {
  const projectsContainerRef = useRef<HTMLDivElement | null>(null)

  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => {
      projectsContainerRef.current?.scrollTop === 0 && eventData.deltaY > 50 && onPrevSlide()
    },
  })

  const { projects, loading } = useProjects()

  const refPassthrough = (el: HTMLDivElement) => {
    handlers.ref(el)
    projectsContainerRef.current = el
  }

  const onPrevSlide = () => slide.isActive && !swiper.destroyed && swiper?.slidePrev()

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (projectsContainerRef.current?.scrollTop !== 0) return

    e.deltaY < 0 && onPrevSlide()
  }

  return (
    <Box
      className={classes.container}
      onWheel={onWheel}
      {...handlers}
      ref={refPassthrough}
    >
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
            loading={loading}
            projects={projects}
          />
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}
