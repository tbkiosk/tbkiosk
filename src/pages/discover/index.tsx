import Head from 'next/head'
import { AppShell, Container, Center, Stack, Title, Box, Text, ActionIcon, rem, createStyles, keyframes } from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'

import { UserProvider } from '@/providers/user'

import { Header, Footer, ProjectsGrid } from '@/components'
import ScrollDown from 'public/icons/scrolldown.svg'

const typing = (maxWidth = '100%') =>
  keyframes({
    from: { width: 0 },
    to: { width: maxWidth },
  })

const show = keyframes({
  '0%': { visibility: 'hidden' },
  '99%': { visibility: 'hidden' },
  '100%': { visibility: 'visible' },
})

const blinkCaret = keyframes({
  'from, to': { borderColor: 'transparent' },
  '50%': { borderColor: '#fd222a' },
})

const hideBlinkCaret = keyframes({
  '99%': { borderRightStyle: 'solid' },
  '100%': { borderRightStyle: 'none' },
})

const bounce = keyframes({
  '0%, 20%, 50%, 80%, 100%': {
    transform: 'translateY(0)',
  },
  '40%': { transform: 'translateY(-14px)' },
  '60%': { transform: 'translateY(-5px)' },
})

const useStyles = createStyles(() => ({
  title: {
    animation: `${typing('592px')} 4s steps(20, end), ${blinkCaret} .75s step-end infinite, ${hideBlinkCaret} 4.1s forwards`,
    borderRight: '2px solid #fd222a',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  subTitle: {
    animation: `${show} 4.1s forwards, ${typing('1016px')} 6s steps(40, end) 4s, ${blinkCaret} .75s step-end infinite`,
    borderRight: '2px solid #fd222a',
    overflow: 'hidden',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
  },
  bounceArrow: {
    animation: `${bounce} 2s ease infinite`,
  },
}))

const Discover = () => {
  const { classes } = useStyles()
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLHeadingElement>({
    duration: 400,
    offset: 120,
  })

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
            >
              <video
                autoPlay
                loop
                muted
                style={{ height: '360px', marginBottom: rem(72), objectFit: 'cover', width: '360px' }}
              >
                <source
                  src="/preview2.mp4"
                  type="video/mp4"
                />
              </video>
              <Text
                className={classes.title}
                ff="pixeloid-mono"
                fz={rem(56)}
                pr={rem(8)}
              >
                Discover
                <Text
                  component="span"
                  fw={700}
                  ml={rem(16)}
                  style={{ color: '#fd222a' }}
                >
                  ERC-6551
                </Text>
              </Text>
              <Text
                className={classes.subTitle}
                ff="pixeloid-mono"
                fz={rem(24)}
                pr={rem(8)}
              >
                Finding and exploring the latest and greatest ERC-6551 projects
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
          h="100vh"
        />
        <Container
          fluid
          pos="relative"
          px={rem(64)}
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
