'use client'

import dynamic from 'next/dynamic'
import { AppShell, Box } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { Swiper, SwiperSlide } from 'swiper/react'
import cx from 'classix'

import SlideOne from './components/slide_one'
import SlideTwo from './components/slide_two'

import classes from './index.module.css'

const Typewriter = dynamic(() => import('typewriter-effect'), { ssr: false })

export default function Main() {
  const largeScreen = useMediaQuery('(min-width: 48em)')

  return (
    <AppShell.Main className={classes.main}>
      <Box className={classes['bg-container']}>
        <Box className={classes['bg-wrapper']}>
          <video
            autoPlay
            className={classes.video}
            loop
            muted
          >
            <source
              src="/kiosk.mp4"
              type="video/mp4"
            />
          </video>
          <Box className={classes['typewritter-container']}>
            {typeof largeScreen === 'boolean' && (
              <Typewriter
                onInit={typewriter => {
                  typewriter
                    .typeString(`<span style="font-family: pixeloid-mono; font-size: ${largeScreen ? '56px' : '24px'}">Discover  </span>`)
                    .typeString(`<span style="color: #fd222a; font-size: ${largeScreen ? '56px' : '24px'}">ERC-6551</span>`)
                    .typeString('<br /><br />')
                    .changeDelay(80)
                    .typeString(
                      `<span style="font-family: pixeloid-mono; font-size: ${
                        largeScreen ? '24px' : '16px'
                      }">Finding and exploring the latest and greatest ERC-6551 projects</span>`
                    )
                    .start()
                }}
                options={{
                  autoStart: true,
                  cursorClassName: cx(classes.cursor, 'Typewriter__cursor'),
                  // devMode: true,
                  delay: 120,
                }}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box className={classes['content-container']}>
        <Swiper
          className={classes.swiper}
          direction="vertical"
          noSwiping
          slidesPerView={1}
          spaceBetween={0}
        >
          <SwiperSlide className={classes.slide}>
            <SlideOne />
          </SwiperSlide>
          <SwiperSlide>
            <SlideTwo />
          </SwiperSlide>
        </Swiper>
      </Box>
    </AppShell.Main>
  )
}