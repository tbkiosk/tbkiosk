// import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  AppShell,
  Container,
  Center,
  Stack,
  Flex,
  Grid,
  Title,
  Image,
  Card,
  AspectRatio,
  Group,
  Box,
  Text,
  Badge,
  LoadingOverlay,
  ActionIcon,
  rem,
  createStyles,
  keyframes,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useScrollIntoView } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'

import { UserProvider } from '@/providers/user'

import { Header, Footer } from '@/components'
import ScrollDown from 'public/icons/scrolldown.svg'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

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

const ProjectCard = ({ id, name, logoUrl, bannerImage, description, categories, website, twitter, discord }: Project) => {
  const router = useRouter()

  return (
    <Card
      display="flex"
      onClick={() => router.push(`/discover/${id}`)}
      padding="sm"
      radius="md"
      sx={{
        flexDirection: 'column',
        transition: 'box-shadow 0.4s ease',
        '&:hover': {
          boxShadow: '0px 4px 20px 0px rgba(141, 141, 141, 0.31)',
        },
      }}
      withBorder
    >
      <Card.Section>
        <AspectRatio ratio={1}>
          <Image
            alt="bg"
            height="100%"
            src={bannerImage}
            styles={{
              figure: {
                height: '100%',
              },
              imageWrapper: {
                height: '100%',
              },
            }}
            width="100%"
            withPlaceholder
          />
        </AspectRatio>
      </Card.Section>
      <Flex
        direction="column"
        gap="xs"
        mt="lg"
        style={{ flex: 1 }}
      >
        <Group
          noWrap
          spacing="md"
        >
          <Image
            alt="bg"
            fit="cover"
            height={rem(40)}
            radius={rem(14)}
            src={logoUrl}
            width={rem(40)}
            withPlaceholder
          />
          <Title
            order={4}
            truncate
          >
            {name}
          </Title>
        </Group>
        <Text
          h={84}
          lh={1.5}
          lineClamp={4}
          mah={84}
          size="sm"
        >
          {description}
        </Text>
        <Group spacing="xs">
          {categories.map(_category => (
            <Badge
              color="dark"
              key={_category}
              size="xs"
              radius="sm"
              variant="filled"
            >
              {_category}
            </Badge>
          ))}
        </Group>
        <Flex
          align="flex-end"
          justify="flex-end"
          style={{ flex: 1 }}
        >
          <Group>
            {website && (
              <a
                href={website}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ActionIcon
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-solid fa-globe"
                    style={{ color: '#fd222a' }}
                  />
                </ActionIcon>
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ActionIcon
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-brands fa-x-twitter"
                    style={{ color: '#fd222a' }}
                  />
                </ActionIcon>
              </a>
            )}
            {discord && (
              <a
                href={discord}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <ActionIcon
                  size="sm"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                  variant="transparent"
                >
                  <i
                    className="fa-brands fa-discord"
                    style={{ color: '#fd222a' }}
                  />
                </ActionIcon>
              </a>
            )}
          </Group>
        </Flex>
      </Flex>
    </Card>
  )
}

const Discover = () => {
  const { classes } = useStyles()
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLHeadingElement>({
    duration: 400,
    offset: 120,
  })

  const { data, isLoading } = useQuery<Project[], Error>({
    queryKey: ['discover'],
    queryFn: async () => {
      const { data, error } = await request<Project[], string>({
        url: '/api/discover',
      })

      if (error) {
        throw new Error(error)
      }

      return data || []
    },
    onError: (error: Error) => {
      notifications.show({
        color: 'red',
        message: error.message,
        title: 'Error',
        withCloseButton: true,
      })
    },
    retry: false,
    refetchOnWindowFocus: false,
  })

  // const featuredProject = useMemo(() => data?.find(_project => _project.isFeatured), [data])

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
            <Grid
              gutter="xl"
              maw={rem(1440)}
              mb={rem(48)}
              pos="relative"
            >
              <LoadingOverlay visible={isLoading} />
              {data?.map(_project => (
                <Grid.Col
                  key={_project.id}
                  md={3}
                  sm={4}
                  xs={6}
                >
                  <Link
                    href={`/discover/${_project.id}`}
                    passHref
                  >
                    <ProjectCard {..._project} />
                  </Link>
                </Grid.Col>
              ))}
            </Grid>
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
