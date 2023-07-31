import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  AppShell,
  Container,
  Title,
  Image,
  Box,
  ActionIcon,
  Flex,
  Text,
  Group,
  Menu,
  LoadingOverlay,
  Badge,
  Tabs,
  Divider,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery } from '@tanstack/react-query'

import { UserProvider } from '@/providers/user'

import { Header } from '@/components'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'

import { request } from '@/utils/request'

import Verified from '@/assets/icons/verified'

import type { Project } from '@/types/project'

const DiscoverDetail = () => {
  const router = useRouter()

  const theme = useMantineTheme()

  const { status } = useSessionGuard()

  const { data, isLoading } = useQuery<Project | undefined, Error>({
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
    enabled: status === 'authenticated',
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
      >
        <LoadingOverlay visible={isLoading} />
        {data && (
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
                src={data.bannerImage}
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
                  src={data.logoUrl}
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
            <Flex
              align="center"
              justify="space-between"
              mb="xs"
            >
              <Group spacing="xs">
                <Title
                  color={isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7]}
                  order={3}
                  truncate
                >
                  {data.name}
                </Title>
                <Verified />
              </Group>
              <Group spacing="lg">
                <ActionIcon
                  size="lg"
                  radius="xl"
                  variant="transparent"
                >
                  <i
                    className="fa-regular fa-star"
                    style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                  />
                </ActionIcon>
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
              mb="xs"
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
                  {new Date(data.createdAt).toDateString()}
                </Text>
              </Box>
            </Group>
            <Group
              mb="xs"
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
                  color="gray"
                  mr="xs"
                  radius="xs"
                >
                  {data.blockchain}
                </Badge>
              </Box>
              <Box>
                <Text
                  component="span"
                  mr={4}
                >
                  Categories:
                </Text>
                {data?.categories?.map(_category => (
                  <Badge
                    color="gray"
                    key={_category}
                    mr="xs"
                    radius="xs"
                  >
                    {_category}
                  </Badge>
                ))}
              </Box>
            </Group>
            <Group
              mb={rem(48)}
              noWrap
              spacing="lg"
            >
              {data?.website && (
                <a
                  href={data.website}
                  onClick={e => e.stopPropagation()}
                  rel="noreferrer"
                  target="_blank"
                >
                  <i
                    className="fa-solid fa-globe"
                    style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                  />
                </a>
              )}
              {data?.twitter && (
                <a
                  href={data.twitter}
                  onClick={e => e.stopPropagation()}
                  rel="noreferrer"
                  target="_blank"
                >
                  <i
                    className="fa-brands fa-twitter"
                    style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                  />
                </a>
              )}
              {data?.discord && (
                <a
                  href={data.discord}
                  onClick={e => e.stopPropagation()}
                  rel="noreferrer"
                  target="_blank"
                >
                  <i
                    className="fa-brands fa-discord"
                    style={{ color: isDarkTheme ? theme.colors.gray[2] : theme.colors.dark[7] }}
                  />
                </a>
              )}
            </Group>
            <Tabs
              color={isDarkTheme ? 'gray.2' : 'dark.7'}
              defaultValue="project-details"
              mb={rem(48)}
            >
              <Tabs.List>
                <Tabs.Tab value="project-details">Project Details</Tabs.Tab>
                <Tabs.Tab value="resources">Resources</Tabs.Tab>
                <Tabs.Tab value="latest-discussions">Latest Discussions</Tabs.Tab>
                <Tabs.Tab value="team-members">Team Members</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel
                value="project-details"
                pt={rem(24)}
              >
                <Title
                  color={theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[7]}
                  mb="xs"
                  order={3}
                >
                  About Project
                </Title>
                <Text>{data?.description}</Text>
              </Tabs.Panel>
              <Tabs.Panel
                value="resources"
                pt={rem(24)}
              >
                -
              </Tabs.Panel>
              <Tabs.Panel
                value="latest-discussions"
                pt={rem(24)}
              >
                -
              </Tabs.Panel>
              <Tabs.Panel
                value="team-members"
                pt={rem(24)}
              >
                -
              </Tabs.Panel>
            </Tabs>
            <Divider my={rem(64)} />
            <Title
              color={theme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[7]}
              mb="xs"
              order={3}
            >
              You may also like this
            </Title>
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
        <title>Morphis Airdawg - Discover</title>
        <meta
          name="description"
          content="Morphis Airdawg discover"
        />
      </Head>
      <UserProvider>
        <DiscoverDetail />
      </UserProvider>
    </>
  )
}

export default DiscoverDetailWrapper
