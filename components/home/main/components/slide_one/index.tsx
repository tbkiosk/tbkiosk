import { useEffect } from 'react'
import { Box, ActionIcon } from '@mantine/core'
import { useSwiper, useSwiperSlide } from 'swiper/react'

import ScrollDown from '/public/icons/scrolldown.svg'

import classes from './index.module.css'

export default function SlideOne() {
  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const onNextSlide = (e: WheelEvent) => e.deltaY > 0 && !swiper.destroyed && swiper?.slideNext()

  useEffect(() => {
    if (slide.isActive) {
      window.addEventListener('wheel', onNextSlide, true)
    } else {
      window.removeEventListener('wheel', onNextSlide, true)
    }
  }, [slide.isActive])

  useEffect(() => () => window.removeEventListener('wheel', onNextSlide, true), [])

  return (
    <Box className={classes.container}>
      <ActionIcon
        onClick={() => swiper.slideNext()}
        variant="transparent"
      >
        <ScrollDown />
      </ActionIcon>
    </Box>
  )
}
