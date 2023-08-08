import Head from 'next/head'
import { AppShell, Container, Center, Stack, Title, Box, Text, ActionIcon, rem, createStyles, keyframes } from '@mantine/core'
import { useScrollIntoView, useMediaQuery } from '@mantine/hooks'
import Typewriter from 'typewriter-effect'

import { UserProvider } from '@/providers/user'

import { Header, Footer, ProjectsGrid } from '@/components'
import ScrollDown from '/public/icons/scrolldown.svg'

const bounce = keyframes({
  '0%, 20%, 50%, 80%, 100%': {
    transform: 'translateY(0)',
  },
  '40%': { transform: 'translateY(-14px)' },
  '60%': { transform: 'translateY(-5px)' },
})

const useStyles = createStyles(theme => ({
  cursor: {
    fontSize: rem(32),
    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(20),
    },
  },
  bounceArrow: {
    animation: `${bounce} 2s ease infinite`,
  },
}))

const Discover = () => {
  const { classes, cx } = useStyles()
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLHeadingElement>({
    duration: 400,
    offset: 120,
  })
  const largeScreen = useMediaQuery('(min-width: 48em)')

  return (
    <AppShell
      header={<Header />}
      px={0}
      styles={{
        main: {
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
            >
              <video
                autoPlay
                loop
                muted
                style={
                  largeScreen
                    ? { height: '360px', marginBottom: rem(72), objectFit: 'cover', width: '360px' }
                    : { height: '180px', marginBottom: rem(32), objectFit: 'cover', width: '180px' }
                }
              >
                <source
                  src="/preview2.mp4"
                  type="video/mp4"
                />
              </video>
              <Text ta="center">
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
            <Box
              bottom={rem(8)}
              className={classes.bounceArrow}
              mx="auto"
              pos="absolute"
            >
              <ActionIcon
                onClick={() => scrollIntoView()}
                variant="transparent"
              >
                <ScrollDown />
              </ActionIcon>
            </Box>
          </Center>
        </Box>
        <Box
          bg="transparent"
          h="calc(100vh - 72px)"
        />
        <Container
          fluid
          pos="relative"
          px={largeScreen ? rem(64) : 'lg'}
          py="lg"
          style={{ zIndex: 1200 }}
          sx={theme => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : '#fff' })}
        >
          <Container
            maw={1440}
            px={0}
          >
            <Title
              my={rem(32)}
              order={4}
              ref={targetRef}
            >
              LATEST PROJECTS
            </Title>
            <ProjectsGrid />
            <Footer />
          </Container>
        </Container>
      </Container>
    </AppShell>
  )
}

const DiscoverWrapper = () => {
  return (
    <>
      <Head>
        <title>Kiosk - Discover</title>
        <meta
          name="description"
          content="Kiosk discover"
        />
      </Head>
      <UserProvider>
        <Discover />
      </UserProvider>
    </>
  )
}

export default DiscoverWrapper
