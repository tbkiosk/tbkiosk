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
} from '@mantine/core'
import { useMediaQuery, useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Carousel } from '@mantine/carousel'
import { useQuery } from '@tanstack/react-query'

import { Header, Footer, ProjectsGrid } from '@/components'

import { request } from '@/utils/request'

import type { Project } from '@prisma/client'

const ProjectDetail = () => {
  const router = useRouter()

  const largeScreen = useMediaQuery('(min-width: 48em)')
  const clipboard = useClipboard({ timeout: 0 })

  const { data: projectData, isLoading: projectDetailLoading } = useQuery<Project | undefined, Error>({
    queryKey: ['project_details', router.query.slug],
    queryFn: async () => {
      const { data, error } = await request<Project | undefined, string>({
        url: `/api/projects/${router.query.slug}`,
      })

      if (error) {
        throw new Error(error)
      }

      return data
    },
    enabled: !!router.query.slug,
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
    if (!router.query.slug) return

    request({
      url: `/api/projects/${router.query.slug}/view`,
      method: 'PUT',
    })
  }, [router.query.slug])

  return (
    <AppShell
      header={<Header />}
      padding={0}
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
        maw={rem(1440)}
        mih={480}
        px={largeScreen ? rem(64) : 'lg'}
        pb="lg"
      >
        <LoadingOverlay visible={projectDetailLoading} />
        {projectData && (
          <>
            <Box
              h={largeScreen ? 480 : 240}
              mb={rem(128)}
            >
              <Image
                alt="bg"
                height={largeScreen ? 480 : 240}
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
                  onClick={() => {
                    router.beforePopState(state => {
                      state.options.scroll = false
                      return true
                    })
                    router.back()
                  }}
                  opacity={0.7}
                  pos="absolute"
                  radius="xl"
                  size="xl"
                  top={rem(largeScreen ? 48 : 24)}
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
                  left={0}
                  mx={largeScreen ? 0 : 'auto'}
                  pos="absolute"
                  radius={56}
                  right={0}
                  src={projectData.logoUrl}
                  styles={{
                    image: {
                      border: '9px solid',
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
                wrap="nowrap"
              >
                <Group
                  noWrap
                  spacing="xs"
                  style={{ overflow: 'hidden' }}
                >
                  <Title
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
                    style={{ flexShrink: 0 }}
                    variant="filled"
                  >
                    {projectData.projectStage}
                  </Badge>
                </Group>
                <Group
                  spacing={largeScreen ? 'lg' : 0}
                  style={{ flexShrink: 0 }}
                >
                  <ActionIcon
                    color="dark"
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(location.href)}&text=${encodeURIComponent(
                          `${projectData.name} | ${projectData.blockchains.join(' ')}`
                        )}`
                      )
                    }
                    radius="xl"
                    size="lg"
                    variant="transparent"
                  >
                    <i className="fa-solid fa-share-nodes" />
                  </ActionIcon>
                  <Menu
                    shadow="md"
                    width={200}
                  >
                    <Menu.Target>
                      <ActionIcon
                        color="dark"
                        radius="xl"
                        size="lg"
                        variant="transparent"
                      >
                        <i className="fa-solid fa-ellipsis" />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          clipboard.copy(location.href)
                          notifications.show({
                            color: 'green',
                            message: 'Copied to clipboard',
                            title: 'Success',
                            withCloseButton: true,
                          })
                        }}
                        icon={<i className="fa-solid fa-copy" />}
                      >
                        Copy link
                      </Menu.Item>
                      {/* <Menu.Item icon={<i className="fa-solid fa-paperclip" />}>Documentation</Menu.Item> */}
                      {/* <Menu.Item icon={<i className="fa-solid fa-circle-question" />}>Contact support</Menu.Item> */}
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        onClick={() =>
                          window.open(
                            `https://docs.google.com/forms/d/e/1FAIpQLSedEm56AAsrkssUTGF2pALbbHzoxiFgwJNrWW0h5uws4hYAxA/viewform?entry.1073118097=${projectData.id}`
                          )
                        }
                        icon={<i className="fa-solid fa-triangle-exclamation" />}
                      >
                        Report
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Flex>
              {largeScreen ? (
                <Group
                  noWrap
                  spacing="lg"
                >
                  <Box>
                    <Text
                      component="span"
                      mr={4}
                    >
                      Added
                    </Text>
                    <Text
                      component="span"
                      fw={700}
                    >
                      {new Date(projectData.createdAt).toDateString()}
                    </Text>
                  </Box>
                </Group>
              ) : (
                <>
                  <Box>
                    <Text
                      component="span"
                      mr={4}
                    >
                      Added
                    </Text>
                    <Text
                      component="span"
                      fw={700}
                    >
                      {new Date(projectData.createdAt).toDateString()}
                    </Text>
                  </Box>
                </>
              )}
              {largeScreen ? (
                <Group
                  noWrap
                  spacing="lg"
                >
                  <Box>
                    <Text
                      component="span"
                      mr={4}
                    >
                      Built on:
                    </Text>
                    {projectData.blockchains.length ? (
                      projectData.blockchains.map(_b => (
                        <Badge
                          color="dark"
                          key={_b}
                          mr="xs"
                          radius="sm"
                          variant="filled"
                        >
                          {_b}
                        </Badge>
                      ))
                    ) : (
                      <Text
                        component="span"
                        fw={700}
                      >
                        -
                      </Text>
                    )}
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
              ) : (
                <>
                  <Box>
                    <Text
                      component="span"
                      mr={4}
                    >
                      Built on:
                    </Text>
                    {projectData.blockchains.length ? (
                      projectData.blockchains.map(_b => (
                        <Badge
                          color="dark"
                          key={_b}
                          mr="xs"
                          radius="sm"
                          variant="filled"
                        >
                          {_b}
                        </Badge>
                      ))
                    ) : (
                      <Text
                        component="span"
                        fw={700}
                      >
                        -
                      </Text>
                    )}
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
                </>
              )}
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
            <Title order={5}>Project Details</Title>
            <Divider />
            <Title
              my={rem(32)}
              order={3}
            >
              About Project
            </Title>
            <Text>{projectData.description}</Text>
            {!!projectData?.previewImages.length && (
              <Carousel
                align="start"
                draggable
                height={largeScreen ? 480 : 240}
                loop
                my={rem(32)}
                slideGap="md"
                slideSize={largeScreen ? '50%' : '100%'}
                withControls={false}
                withIndicators
              >
                {projectData.previewImages.map(_pi => (
                  <Carousel.Slide key={_pi}>
                    <Image
                      alt=""
                      fit="cover"
                      height={largeScreen ? 480 : 240}
                      radius="md"
                      src={_pi}
                      width="100%"
                      withPlaceholder
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            )}
            <Divider my={rem(32)} />
            <Title
              mb={rem(32)}
              order={3}
            >
              You may also like this
            </Title>
            <ProjectsGrid
              limit={6}
              replace
            />
            <Footer />
          </>
        )}
      </Container>
    </AppShell>
  )
}

const ProjectDetailWrapper = () => {
  return (
    <>
      <Head>
        <title>Kiosk - Project</title>
        <meta
          name="description"
          content="Kiosk project"
        />
      </Head>
      <ProjectDetail />
    </>
  )
}

export default ProjectDetailWrapper
