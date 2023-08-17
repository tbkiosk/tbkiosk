import { useEffect } from 'react'
import { Box, ActionIcon } from '@mantine/core'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import ScrollDown from '/public/icons/scrolldown.svg'

import classes from './index.module.css'

export default function SlideOne() {
  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => eventData.deltaY < -10 && onNextSlide(),
  })

  const onWheel = (e: WheelEvent) => e.deltaY > 0 && onNextSlide()

  const onNextSlide = () => slide.isActive && !swiper.destroyed && swiper?.slideNext()

  useEffect(() => {
    if (slide.isActive) {
      window.addEventListener('wheel', onWheel)
    } else {
      window.removeEventListener('wheel', onWheel)
    }
  }, [slide.isActive])

  useEffect(() => () => window.removeEventListener('wheel', onWheel), [])

  return (
    <Box
      className={classes.container}
      {...handlers}
    >
      <Box className={classes['icon-container']}>
        <ActionIcon
          onClick={() => swiper.slideNext()}
          variant="transparent"
        >
          <ScrollDown />
        </ActionIcon>
      </Box>
    </Box>
  )
}
