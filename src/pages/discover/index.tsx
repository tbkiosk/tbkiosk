import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AppShell, Container, Title, Image, Box, Flex, Grid, Card, AspectRatio, Group, Text, Badge, ActionIcon, rem } from '@mantine/core'

import { UserProvider } from '@/providers/user'

import { Header } from '@/components'

type Project = {
  id: string
  icon: string
  name: string
  desc: string
  categories: string[]
}

const featuredProjects: Project[] = [
  {
    id: 'OKPC',
    icon: 'OKPC',
    name: 'OKPC',
    desc: "OKPC is an onchain toy that let's you create, collect and share artwork.",
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
  {
    id: 'Gandalf',
    icon: 'Gandalf',
    name: 'Gandalf',
    desc: "Tokengate any web2 content so it's exclusive only to members of your web3 community.",
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
  {
    id: 'SWING',
    icon: 'SWING',
    name: 'SWING',
    desc: 'Your Avatar will represent you not only in Parallel TCG, but in other upcoming online activations and explorations.',
    categories: ['Mainnet', 'Gaming', 'Ethereum'],
  },
]

const ProjectCard = ({ id, name, desc, categories }: Project) => {
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
        <AspectRatio
          ratio={1}
          mx="auto"
        >
          <Image
            alt="bg"
            fit="cover"
            height="100%"
            src={`https://picsum.photos/seed/${id}/400`}
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
            src={`https://picsum.photos/seed/${desc}/40`}
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
          {desc}
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
            <a
              href="/"
              onClick={e => e.stopPropagation()}
              target="_blank"
            >
              <i className="fa-solid fa-globe" />
            </a>
            <a
              href="https://twitter.com"
              onClick={e => e.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-twitter" />
            </a>
            <a
              href="https://discord.com"
              onClick={e => e.stopPropagation()}
              rel="noreferrer"
              target="_blank"
            >
              <i className="fa-brands fa-discord" />
            </a>
          </Group>
        </Flex>
      </Flex>
    </Card>
  )
}

const Discover = () => {
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
        <Box h={600}>
          <Link href="/discover/top">
            <Image
              alt="bg"
              fit="cover"
              height="600"
              left={0}
              pos="absolute"
              right={0}
              src="/bg.jpg"
              top={72 + 16}
              withPlaceholder
            />
          </Link>
        </Box>
        <Title
          my={rem(32)}
          order={4}
        >
          Upcoming Projects
        </Title>
        <Grid
          gutter="xl"
          mb={rem(48)}
        >
          {featuredProjects.map(_item => (
            <Grid.Col
              key={_item.name}
              md={3}
              sm={4}
              xs={6}
            >
              <ProjectCard {..._item} />
            </Grid.Col>
          ))}
        </Grid>
        <Box>
          <Title
            order={4}
            mb={rem(8)}
            ta="center"
          >
            Join the community
          </Title>
          <Group
            noWrap
            position="center"
          >
            <ActionIcon
              radius="md"
              size="lg"
              variant="light"
            >
              <a
                href="https://twitter.com"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-twitter" />
              </a>
            </ActionIcon>
            <ActionIcon
              radius="md"
              size="lg"
              variant="light"
            >
              <a
                href="https://discord.com"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-discord" />
              </a>
            </ActionIcon>
            <ActionIcon
              radius="md"
              size="lg"
              variant="light"
            >
              <a
                href="https://youtube.com"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-youtube" />
              </a>
            </ActionIcon>
            <ActionIcon
              radius="md"
              size="lg"
              variant="light"
            >
              <a
                href="https://tiktok.com"
                rel="noreferrer"
                target="_blank"
              >
                <i className="fa-brands fa-tiktok" />
              </a>
            </ActionIcon>
          </Group>
        </Box>
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
