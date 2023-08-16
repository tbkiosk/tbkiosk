import { useRef } from 'react'
import { Box } from '@mantine/core'
import { useSwiper } from 'swiper/react'

import Footer from 'components/home/footer'

import classes from './index.module.css'

export default function SlideTwo() {
  const projectsContainerRef = useRef<HTMLDivElement>(null)

  const swiper = useSwiper()

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (projectsContainerRef.current?.scrollTop !== 0) return

    e.deltaY < 0 && !swiper.destroyed && swiper?.slidePrev()
  }

  return (
    <Box
      className={classes.container}
      ref={projectsContainerRef}
      onWheel={onWheel}
    >
      <Box className={classes.wrapper}>
        <h1>testr123</h1>
        <Footer />
      </Box>
    </Box>
  )
}
