import { useRef } from 'react'
import { Box } from '@mantine/core'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import Footer from 'components/home/footer'

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
        <Box className={classes['projects-container']}>
          <h1>testr123</h1>
          <h1 style={{ height: '1204px' }}>testr123</h1>
          <h1>testr123</h1>
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}
