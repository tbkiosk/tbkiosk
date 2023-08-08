import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  AppShell,
  Container,
  Title,
  Image,
  Box,
  Stack,
  ActionIcon,
  Flex,
  Text,
  Group,
  Menu,
  LoadingOverlay,
  Badge,
  Divider,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Carousel } from '@mantine/carousel'
import { useQuery } from '@tanstack/react-query'

import { UserProvider } from '@/providers/user'

import { Header, Footer, FavoriteButton, ProjectsGrid } from '@/components'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

const DiscoverDetail = () => {
  const router = useRouter()

  const theme = useMantineTheme()

  const { data: projectData, isLoading: projectDetailLoading } = useQuery<Project | undefined, Error>({
    queryKey: ['discover_details', router.query.id],
    queryFn: async () => {
      const { data, error } = await request<Project | undefined, string>({
        url: `/api/discover/${router.query.id}`,
      })

      if (error) {
        throw new Error(error)
      }

      return data
    },
    enabled: !!router.query.id,
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

  useEffect(() => {
    if (!router.query.id) return

    request({
      url: `/api/discover/${router.query.id}/view`,
      method: 'PUT',
    })
  }, [router.query.id])

  const isDarkTheme = theme.colorScheme === 'dark'

  return (
    <AppShell
      header={<Header />}
      padding={0}
    >
      <Container
        maw={rem(1440)}
        mih={480}
        px={rem(72)}
        pb="lg"
      >
        <LoadingOverlay visible={projectDetailLoading} />
        {projectData && (
          <>
            <Box
              h={480}
              mb={rem(128)}
            >
              <Image
                alt="bg"
                height={480}
                left={0}
                pos="absolute"
                right={0}
                src={projectData.bannerImage}
                top={72}
                w="100%"
                withPlaceholder
              />
              <Box
                h="100%"
                pos="relative"
              >
                <ActionIcon
                  color="dark.0"
                  left={0}
                  onClick={() => router.push('/discover')}
                  opacity={0.7}
                  pos="absolute"
                  radius="xl"
                  size="xl"
                  top={48}
                  variant="filled"
                >
                  <i
                    className="fa-solid fa-chevron-left"
                    style={{ color: '#000' }}
                  />
                </ActionIcon>
                <Image
                  alt="bg"
                  bottom={-84}
                  height={168}
                  pos="absolute"
                  radius={56}
                  src={projectData.logoUrl}
                  styles={{
                    image: {
                      border: '9px solid',
                      borderColor: isDarkTheme ? theme.colors.dark[7] : '#fff',
                    },
                  }}
                  width={168}
                  withPlaceholder
                />
              </Box>
            </Box>
            <Stack mb={rem(48)}>
              <Flex
                align="center"
                justify="space-between"
              >
                <Group spacing="xs">
                  <Title
                    color={isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7]}
                    order={3}
                    truncate
                  >
                    {projectData.name}
                  </Title>
                  <Badge
                    c="#000"
                    color="yellow.3"
                    mr="xs"
                    radius="sm"
                    variant="filled"
                  >
                    {projectData.projectStage}
                  </Badge>
                </Group>
                <Group spacing="lg">
                  <FavoriteButton
                    defaultFavorited={false}
                    onFavorite={() => void 0}
                    onUnfavorite={() => void 0}
                  />
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    variant="transparent"
                  >
                    <i
                      className="fa-solid fa-share-nodes"
                      style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                    />
                  </ActionIcon>
                  <Menu
                    shadow="md"
                    width={200}
                  >
                    <Menu.Target>
                      <ActionIcon
                        size="lg"
                        radius="xl"
                        variant="transparent"
                      >
                        <i
                          className="fa-solid fa-ellipsis"
                          style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                        />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item icon={<i className="fa-solid fa-copy" />}>Copy link</Menu.Item>
                      <Menu.Item icon={<i className="fa-solid fa-paperclip" />}>Documentation</Menu.Item>
                      <Menu.Item icon={<i className="fa-solid fa-circle-question" />}>Contact support</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        icon={<i className="fa-solid fa-triangle-exclamation" />}
                      >
                        Report
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Flex>
              <Group
                noWrap
                spacing="lg"
              >
                <Box>
                  <Text
                    component="span"
                    mr={4}
                  >
                    By
                  </Text>
                  <Text
                    color={isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7]}
                    component="span"
                    fw={700}
                  >
                    -
                  </Text>
                </Box>
                <Box>
                  <Text
                    component="span"
                    mr={4}
                  >
                    Created
                  </Text>
                  <Text
                    color={isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7]}
                    component="span"
                    fw={700}
                  >
                    {new Date(projectData.createdAt).toDateString()}
                  </Text>
                </Box>
              </Group>
              <Group
                noWrap
                spacing="lg"
              >
                <Box>
                  <Text
                    component="span"
                    mr={4}
                  >
                    Categories:
                  </Text>
                  <Badge
                    color="dark"
                    mr="xs"
                    radius="sm"
                    variant="filled"
                  >
                    {projectData.blockchain}
                  </Badge>
                </Box>
                <Box>
                  <Text
                    component="span"
                    mr={4}
                  >
                    Categories:
                  </Text>
                  {projectData?.categories?.map(_category => (
                    <Badge
                      color="dark"
                      key={_category}
                      mr="xs"
                      radius="sm"
                      variant="filled"
                    >
                      {_category}
                    </Badge>
                  ))}
                </Box>
              </Group>
              <Group
                noWrap
                spacing="xl"
              >
                {projectData?.website && (
                  <a
                    href={projectData.website}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      color="dark"
                      size="sm"
                      sx={{
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      variant="transparent"
                    >
                      <i className="fa-solid fa-globe" />
                    </ActionIcon>
                  </a>
                )}
                {projectData?.twitter && (
                  <a
                    href={projectData.twitter}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      color="dark"
                      size="sm"
                      sx={{
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      variant="transparent"
                    >
                      <i className="fa-brands fa-x-twitter" />
                    </ActionIcon>
                  </a>
                )}
                {projectData?.discord && (
                  <a
                    href={projectData.discord}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ActionIcon
                      color="dark"
                      size="sm"
                      sx={{
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      variant="transparent"
                    >
                      <i className="fa-brands fa-discord" />
                    </ActionIcon>
                  </a>
                )}
              </Group>
            </Stack>
            {!!projectData?.previewImages.length && (
              <Carousel
                align="start"
                draggable
                height={480}
                loop
                mb={rem(32)}
                slideGap="md"
                slideSize="50%"
                withControls={false}
                withIndicators
              >
                {projectData.previewImages.map(_pi => (
                  <Carousel.Slide key={_pi}>
                    <Image
                      alt=""
                      fit="cover"
                      height={480}
                      radius="md"
                      src={_pi}
                      width="100%"
                      withPlaceholder
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}
            <Title order={5}>Project Details</Title>
            <Divider />
            <Title
              my={rem(32)}
              order={3}
            >
              About Project
            </Title>
            <Text>{projectData.description}</Text>
            <Divider my={rem(32)} />
            <Title
              mb={rem(32)}
              order={3}
            >
              You may also like this
            </Title>
            <ProjectsGrid limit={6} />
            <Footer />
          </>
        )}
      </Container>
    </AppShell>
  )
}

const DiscoverDetailWrapper = () => {
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
        <DiscoverDetail />
      </UserProvider>
    </>
  )
}

export default DiscoverDetailWrapper
