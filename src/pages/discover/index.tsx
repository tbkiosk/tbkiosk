import Head from 'next/head'
import Link from 'next/link'
import {
  AppShell,
  Container,
  Title,
  Image,
  Box,
  Flex,
  Text,
  Group,
  Input,
  Divider,
  Button,
  Grid,
  Card,
  ScrollArea,
  rem,
} from '@mantine/core'

import { UserProvider } from '@/providers/user'

import { Header } from '@/components'

import Verified from '@/assets/icons/verified'

type Project = {
  id: string
  icon: string
  name: string
  verified: boolean
  desc: string
  categories: string[]
}

const hottestProjects: Project[] = [
  {
    id: 'Parallel',
    icon: 'Parallel',
    name: 'Parallel',
    verified: true,
    desc: 'In the expanding Parallel Universe, Avatars serve as the gateway to new experiences. Your Avatar will represent you not only in Parallel TCG, but in other upcoming online activations and explorations.',
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
  {
    id: 'Angry Dynomites Lab',
    icon: 'Angry Dynomites Lab',
    name: 'Angry Dynomites Lab',
    verified: false,
    desc: '🔥 The Genesis Fire Dyno collection is the first of four collections, followed by 💧Water Dynos, 🌱 Earth, and 💨 Air',
    categories: ['Mainnet', 'zkSync'],
  },
  {
    id: 'Dawn of East',
    icon: 'Dawn of East',
    name: 'Dawn of East',
    verified: true,
    desc: 'In the expanding Parallel Universe, Avatars serve as the gateway to new experiences. Your Avatar will represent you not only in Parallel TCG, but in other upcoming online activations and explorations.',
    categories: ['In development', 'Polygon', 'NFT'],
  },
]

const featuredProjects: Project[] = [
  {
    id: 'OKPC',
    icon: 'OKPC',
    name: 'OKPC',
    verified: false,
    desc: "OKPC is an onchain toy that let's you create, collect and share artwork.",
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
  {
    id: 'Gandalf',
    icon: 'Gandalf',
    name: 'Gandalf',
    verified: true,
    desc: "Tokengate any web2 content so it's exclusive only to members of your web3 community.",
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
  {
    id: 'SWING',
    icon: 'SWING',
    name: 'SWING',
    verified: true,
    desc: 'Your Avatar will represent you not only in Parallel TCG, but in other upcoming online activations and explorations.',
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
]

const ProjectCard = ({ id, icon, name, verified, desc, categories, isHottest }: Project & { isHottest: boolean }) => (
  <Link href={`/discover/${id}`}>
    <Card
      h={isHottest ? 420 : 260}
      padding="lg"
      pb="sm"
      pos="relative"
      radius="lg"
      withBorder
    >
      <Flex
        direction="column"
        h="100%"
      >
        {isHottest ? (
          <>
            <Image
              alt="logo"
              height={100}
              mb="lg"
              radius={50}
              src={`https://picsum.photos/seed/${icon}/100`}
              width={100}
            />
            <Group
              mb="lg"
              spacing="xs"
            >
              <Title
                order={3}
                truncate
              >
                {name}
              </Title>
              {verified && <Verified />}
            </Group>
          </>
        ) : (
          <Group
            mb="lg"
            pr={64}
            spacing="xs"
          >
            <Image
              alt="logo"
              height={40}
              radius={20}
              src={`https://picsum.photos/seed/${icon}/40`}
              width={40}
            />
            <Title
              order={4}
              truncate
            >
              {name}
            </Title>
            {verified && <Verified />}
          </Group>
        )}
        <Text
          c="gray"
          lh={1.25}
          lineClamp={isHottest ? 5 : 4}
          mb="lg"
        >
          {desc}
        </Text>
        <Flex style={{ flex: 1, flexDirection: 'column-reverse' }}>
          <ScrollArea
            pb={8}
            offsetScrollbars
            type="hover"
            w="100%"
          >
            <Group
              noWrap
              spacing="xs"
            >
              {categories.map(_c => (
                <Button
                  color="gray"
                  key={_c}
                  radius="xl"
                  size="sm"
                  variant="outline"
                >
                  {_c}
                </Button>
              ))}
            </Group>
          </ScrollArea>
        </Flex>
      </Flex>
    </Card>
  </Link>
)

const Discover = () => {
  return (
    <AppShell
      header={<Header />}
      padding="md"
    >
      <Container
        maw={rem(1440)}
        pt={rem(48)}
        px={rem(64)}
      >
        <Title
          c="gray.5"
          fw={400}
          order={4}
        >
          Discover,
        </Title>
        <Title
          fw={400}
          mb="lg"
          order={1}
        >
          Today&apos;s project by Portal 👋
        </Title>
        <Box
          h={800}
          mb={rem(48)}
          pos="relative"
          w="100%"
        >
          <Image
            alt="bg"
            height={800}
            radius="md"
            src="https://picsum.photos/1400/800"
            w="100%"
            withPlaceholder
          />
          <Box
            bottom={rem(32)}
            left={rem(32)}
            maw={500}
            pos="absolute"
          >
            <Flex
              align="center"
              mb="md"
            >
              <Image
                alt="logo"
                height={60}
                mr={rem(16)}
                radius="xl"
                src="https://picsum.photos/120"
                width={60}
              />
              <Text
                c="gray.1"
                fw={500}
                fz={rem(32)}
              >
                The Explorer
              </Text>
            </Flex>
            <Text
              c="gray.1"
              lh={1.25}
            >
              Among the universe of the Cute Planet collection, there are numerous undiscovered worlds nobody has ever set foot in. Let us
              say hi to him before he leaves quickly to embark on another adventure.
            </Text>
          </Box>
          <Group
            bottom={rem(32)}
            maw={400}
            pos="absolute"
            right={rem(32)}
            spacing="md"
          >
            <Image
              alt="logo"
              height={100}
              radius="sm"
              src="https://picsum.photos/seed/1/120/100"
              width={120}
            />
            <Image
              alt="logo"
              height={100}
              radius="sm"
              src="https://picsum.photos/seed/2/120/100"
              width={120}
            />
            <Image
              alt="logo"
              height={100}
              radius="sm"
              src="https://picsum.photos/seed/3/120/100"
              width={120}
            />
          </Group>
        </Box>
        <Flex
          align="centere"
          mb={rem(48)}
        >
          <Box w="50%">
            <Input
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    stroke="none"
                    d="M0 0h24v24H0z"
                    fill="none"
                  ></path>
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                  <path d="M21 21l-6 -6"></path>
                </svg>
              }
              placeholder="Search projects..."
              radius="lg"
              size="lg"
            />
          </Box>
          <Divider
            mx="lg"
            orientation="vertical"
          />
          <Group
            spacing="sm"
            w="50%"
          >
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              NFT
            </Button>
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              Gaming
            </Button>
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              Metaverse
            </Button>
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              Music
            </Button>
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              Art
            </Button>
            <Button
              color="gray"
              radius="xl"
              size="md"
              variant="outline"
            >
              DAO
            </Button>
          </Group>
        </Flex>
        <Flex
          align="center"
          justify="space-between"
          mb={rem(24)}
        >
          <Title
            fw={500}
            order={2}
          >
            Hottest 🔥
          </Title>
          <Link
            style={{ color: '#0062ff' }}
            href="/discover"
          >
            View all
          </Link>
        </Flex>
        <Grid
          gutter="lg"
          mb={rem(48)}
        >
          {hottestProjects.map(_item => (
            <Grid.Col
              key={_item.name}
              span={4}
            >
              <ProjectCard
                isHottest
                {..._item}
              />
            </Grid.Col>
          ))}
        </Grid>
        <Flex
          align="center"
          justify="space-between"
          mb={rem(24)}
        >
          <Title
            fw={500}
            order={2}
          >
            Featured ✨
          </Title>
          <Link
            style={{ color: '#0062ff' }}
            href="/discover"
          >
            View all
          </Link>
        </Flex>
        <Grid
          gutter="lg"
          mb={rem(48)}
        >
          {featuredProjects.map(_item => (
            <Grid.Col
              key={_item.name}
              span={4}
            >
              <ProjectCard
                isHottest={false}
                {..._item}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </AppShell>
  )
}

const DiscoverWrapper = () => {
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
        <Discover />
      </UserProvider>
    </>
  )
}

export default DiscoverWrapper
