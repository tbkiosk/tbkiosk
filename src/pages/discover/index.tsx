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

const Verified = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21.1744 9.91867C20.8209 9.5493 20.4553 9.16867 20.3175 8.83398C20.19 8.52742 20.1825 8.0193 20.175 7.52711C20.1609 6.61211 20.1459 5.57523 19.425 4.8543C18.7041 4.13336 17.6672 4.11836 16.7522 4.1043C16.26 4.0968 15.7519 4.0893 15.4453 3.9618C15.1116 3.82398 14.73 3.45836 14.3606 3.10492C13.7137 2.48336 12.9788 1.7793 12 1.7793C11.0212 1.7793 10.2872 2.48336 9.63937 3.10492C9.27 3.45836 8.88938 3.82398 8.55469 3.9618C8.25 4.0893 7.74 4.0968 7.24781 4.1043C6.33281 4.11836 5.29594 4.13336 4.575 4.8543C3.85406 5.57523 3.84375 6.61211 3.825 7.52711C3.8175 8.0193 3.81 8.52742 3.6825 8.83398C3.54469 9.16773 3.17906 9.5493 2.82562 9.91867C2.20406 10.5655 1.5 11.3005 1.5 12.2793C1.5 13.258 2.20406 13.9921 2.82562 14.6399C3.17906 15.0093 3.54469 15.3899 3.6825 15.7246C3.81 16.0312 3.8175 16.5393 3.825 17.0315C3.83906 17.9465 3.85406 18.9834 4.575 19.7043C5.29594 20.4252 6.33281 20.4402 7.24781 20.4543C7.74 20.4618 8.24813 20.4693 8.55469 20.5968C8.88844 20.7346 9.27 21.1002 9.63937 21.4537C10.2863 22.0752 11.0212 22.7793 12 22.7793C12.9788 22.7793 13.7128 22.0752 14.3606 21.4537C14.73 21.1002 15.1106 20.7346 15.4453 20.5968C15.7519 20.4693 16.26 20.4618 16.7522 20.4543C17.6672 20.4402 18.7041 20.4252 19.425 19.7043C20.1459 18.9834 20.1609 17.9465 20.175 17.0315C20.1825 16.5393 20.19 16.0312 20.3175 15.7246C20.4553 15.3909 20.8209 15.0093 21.1744 14.6399C21.7959 13.993 22.5 13.258 22.5 12.2793C22.5 11.3005 21.7959 10.5665 21.1744 9.91867ZM16.2806 10.5599L11.0306 15.8099C10.961 15.8797 10.8783 15.935 10.7872 15.9727C10.6962 16.0105 10.5986 16.0299 10.5 16.0299C10.4014 16.0299 10.3038 16.0105 10.2128 15.9727C10.1217 15.935 10.039 15.8797 9.96937 15.8099L7.71937 13.5599C7.57864 13.4192 7.49958 13.2283 7.49958 13.0293C7.49958 12.8303 7.57864 12.6394 7.71937 12.4987C7.86011 12.3579 8.05098 12.2789 8.25 12.2789C8.44902 12.2789 8.63989 12.3579 8.78063 12.4987L10.5 14.219L15.2194 9.49867C15.2891 9.42899 15.3718 9.37371 15.4628 9.336C15.5539 9.29829 15.6515 9.27888 15.75 9.27888C15.8485 9.27888 15.9461 9.29829 16.0372 9.336C16.1282 9.37371 16.2109 9.42899 16.2806 9.49867C16.3503 9.56835 16.4056 9.65108 16.4433 9.74212C16.481 9.83317 16.5004 9.93075 16.5004 10.0293C16.5004 10.1278 16.481 10.2254 16.4433 10.3165C16.4056 10.4075 16.3503 10.4902 16.2806 10.5599Z"
      fill="#0062FF"
    />
  </svg>
)

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
