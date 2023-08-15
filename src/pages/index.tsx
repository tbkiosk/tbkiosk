import Head from 'next/head'
import { AppShell, Container, Center, Stack, Box, Text, rem, createStyles } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Typewriter from 'typewriter-effect'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HashNavigation } from 'swiper/modules'

import { Header } from '@/components'
import Slide1 from '@/components/home/slide1'
import Slide2 from '@/components/home/slide2'

const useStyles = createStyles(theme => ({
  cursor: {
    fontSize: rem(32),
    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(20),
    },
  },
}))

const Projects = () => {
  const { classes, cx } = useStyles()
  const largeScreen = useMediaQuery('(min-width: 48em)')

  return (
    <AppShell
      header={<Header />}
      px={0}
      styles={{
        main: {
          overflowX: 'hidden',
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      }}
    >
      <Container
        fluid
        pos="relative"
        px={0}
      >
        <Box
          bottom={0}
          h="calc(100vh - 72px)"
          left={0}
          mt={rem(-16)}
          mx={rem(-16)}
          pos="fixed"
          right={0}
        >
          <Center
            h="100%"
            pos="relative"
            px={rem(64)}
            style={{ backgroundColor: '#000', color: '#fff' }}
          >
            <Stack
              align="center"
              spacing={0}
              style={{ zIndex: 600 }}
            >
              {typeof largeScreen === 'boolean' && (
                <video
                  autoPlay
                  loop
                  muted
                  style={
                    largeScreen
                      ? { height: '206px', marginBottom: rem(72), objectFit: 'cover', width: '206px' }
                      : { height: '180px', marginBottom: rem(32), objectFit: 'cover', width: '180px' }
                  }
                >
                  <source
                    src="/kiosk.mp4"
                    type="video/mp4"
                  />
                </video>
              )}
              <Text
                h={largeScreen ? 172 : 160}
                ta="center"
              >
                {typeof largeScreen === 'boolean' && (
                  <Typewriter
                    onInit={typewriter => {
                      typewriter
                        .typeString(
                          `<span style="font-family: pixeloid-mono; font-size: ${largeScreen ? '56px' : '24px'}">Discover  </span>`
                        )
                        .typeString(`<span style="color: #fd222a; font-size: ${largeScreen ? '56px' : '24px'}">ERC-6551</span>`)
                        .typeString('<br></br>')
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
              </Text>
            </Stack>
          </Center>
        </Box>
        <Box
          h="calc(100vh - 72px)"
          mt={rem(-16)}
          inset={0}
          pos="absolute"
        >
          <Swiper
            direction="vertical"
            hashNavigation={{
              watchState: true,
            }}
            modules={[HashNavigation]}
            noSwiping
            slidesPerView={1}
            spaceBetween={0}
            style={{ height: '100%', width: '100%' }}
          >
            <SwiperSlide
              data-hash="slide1"
              style={{ position: 'relative' }}
            >
              <Slide1 />
            </SwiperSlide>
            <SwiperSlide data-hash="slide2">
              <Slide2 />
            </SwiperSlide>
          </Swiper>
        </Box>
      </Container>
    </AppShell>
  )
}

const ProjectsWrapper = () => {
  return (
    <>
      <Head>
        <title>Kiosk - Home</title>
        <meta
          name="description"
          content="Kiosk projects"
        />
      </Head>
      <Projects />
    </>
  )
}

export default ProjectsWrapper
