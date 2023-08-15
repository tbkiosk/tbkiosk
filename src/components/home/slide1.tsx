import { useEffect } from 'react'
import { Box, ActionIcon, rem, createStyles, keyframes } from '@mantine/core'
import { useSwiper, useSwiperSlide } from 'swiper/react'

import ScrollDown from '/public/icons/scrolldown.svg'

const bounce = keyframes({
  '0%, 20%, 50%, 80%, 100%': {
    transform: 'translateY(0)',
  },
  '40%': { transform: 'translateY(-14px)' },
  '60%': { transform: 'translateY(-5px)' },
})

const useStyles = createStyles({
  bounceArrow: {
    animation: `${bounce} 2s ease infinite`,
  },
})

const Slide1 = () => {
  const { classes } = useStyles()

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
    <Box
      bottom={rem(12)}
      className={classes.bounceArrow}
      left={0}
      pos="absolute"
      right={0}
    >
      <ActionIcon
        mx="auto"
        onClick={() => swiper.slideNext()}
        variant="transparent"
      >
        <ScrollDown />
      </ActionIcon>
    </Box>
  )
}

export default Slide1
