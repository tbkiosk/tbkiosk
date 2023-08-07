// import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AppShell, Container, Title, Image, Flex, Grid, Card, AspectRatio, Group, Text, Badge, LoadingOverlay, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'

import { UserProvider } from '@/providers/user'

import { Header, Footer } from '@/components'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

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
        height: '560px',

        '@media (max-width: 62rem)': {
          height: '520px',
        },

        '@media (max-width: 48rem)': {
          height: '500px',
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
          lh={1.5}
          lineClamp={4}
          size="sm"
        >
          {description}
        </Text>
        <Group spacing="xs">
          {categories.map(_category => (
            <Badge
              color="gray"
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
                <i className="fa-solid fa-globe" />
              </a>
            )}
            {twitter && (
              <a
                href={twitter}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-x-twitter" />
              </a>
            )}
            {discord && (
              <a
                href={discord}
                onClick={e => e.stopPropagation()}
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-discord" />
              </a>
            )}
          </Group>
        </Flex>
      </Flex>
    </Card>
  )
}

const Discover = () => {
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
      padding="md"
      styles={{
        main: {
          overflowX: 'hidden',
        },
      }}
    >
      <Container
        maw={rem(1440)}
        px={rem(64)}
      >
        <Image
          alt="banner"
          fit="cover"
          height={280}
          mx="auto"
          my={rem(64)}
          src="/images/banner.png"
          width={440}
          withPlaceholder
        />
        <Title
          my={rem(32)}
          order={4}
        >
          Upcoming Projects
        </Title>
        <Grid
          gutter="xl"
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
