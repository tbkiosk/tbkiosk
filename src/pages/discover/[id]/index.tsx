import Head from 'next/head'
import { useRouter } from 'next/router'
import { AppShell, Container, Title, Image, Box, ActionIcon, Flex, Text, Group, Button, rem } from '@mantine/core'
import { Carousel } from '@mantine/carousel'

import { UserProvider } from '@/providers/user'

import { Header } from '@/components'

import Verified from '@/assets/icons/verified'

const DiscoverDetail = () => {
  const router = useRouter()

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
        <Box
          h={400}
          mb={50 + 24}
          pos="relative"
        >
          <Image
            alt="bg"
            height={400}
            src="https://picsum.photos/1400/400"
            w="100%"
            withPlaceholder
          />
          <ActionIcon
            color="dark.0"
            left={48}
            onClick={() => router.push('/discover')}
            opacity={0.7}
            pos="absolute"
            radius="xl"
            size="xl"
            top={48}
            variant="filled"
          >
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18.2793L9 12.2793L15 6.2793"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ActionIcon>
          <Image
            alt="bg"
            bottom={-50}
            height={100}
            left={48}
            pos="absolute"
            radius={50}
            src="https://picsum.photos/100"
            styles={{
              image: {
                border: '2px solid #fff',
                borderTopLeftRadius: 50,
                borderTopRightRadius: 50,
              },
            }}
            width={100}
            withPlaceholder
          />
        </Box>
        <Flex
          align="center"
          justify="space-between"
        >
          <Group
            mb="lg"
            spacing="xs"
          >
            <Title
              order={3}
              truncate
            >
              Parallel
            </Title>
            <Verified />
          </Group>
        </Flex>
        <Group
          mb={32}
          noWrap
          spacing={32}
        >
          <Box>
            <Title order={3}>0.0768 ETH</Title>
            <Text c="gray.5">🎁 Floor price</Text>
          </Box>
          <Box>
            <Title order={3}>Jun 2023</Title>
            <Text c="gray.5">🔮 Created</Text>
          </Box>
          <Box>
            <Title order={3}>11.5 K</Title>
            <Text c="gray.5">🤖 Items</Text>
          </Box>
        </Group>
        <Carousel
          align="start"
          draggable
          height={480}
          loop
          mb={32}
          slideGap="md"
          slideSize="50%"
          withControls={false}
          withIndicators
        >
          <Carousel.Slide>
            <Image
              alt=""
              fit="cover"
              height={480}
              radius="md"
              src="https://picsum.photos/seed/carousel1/640/480"
              width="100%"
              withPlaceholder
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image
              alt=""
              fit="cover"
              height={480}
              radius="md"
              src="https://picsum.photos/seed/carousel2/640/480"
              width="100%"
              withPlaceholder
            />
          </Carousel.Slide>
          <Carousel.Slide>
            <Image
              alt=""
              fit="cover"
              height={480}
              radius="md"
              src="https://picsum.photos/seed/carousel3/640/480"
              width="100%"
              withPlaceholder
            />
          </Carousel.Slide>
        </Carousel>
        <Title
          fw={500}
          mb="lg"
          order={3}
        >
          Categories
        </Title>
        <Group
          mb={64}
          noWrap
          spacing="xs"
        >
          {['Mainnet', 'Ethereum', 'Gaming'].map(_c => (
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
        <Title
          fw={500}
          mb="lg"
          order={3}
        >
          About
        </Title>
        <Text
          c="gray"
          dangerouslySetInnerHTML={{ __html: desc.replaceAll('/\n', '<br /><br />') }}
          lh={1.25}
          mb="lg"
        />
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

const desc = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. totam rem aperiam, eaque ipsa
quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
sit aspernatur. /\n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua. Ut enim ad mini veniam. /\n 📖 Utilities of Rekt Dogs NFT /\n 🔥 Lorem ipsum dolor sit amet, consectetur adipiscing elit /\n 🔥
Ut enim ad mini veniam /\n 🔥 Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo /\n 🔥 Voluptatem accusantium 💬 Odit aut
fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt, as below: /\n 👉 Gui dolorem ipsum quia dolor
sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore /\n 👉 Zmagnam aliquam
quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem. /\n 👉 APR Rewards Pass 💳 - eprehenderit qui in ea
voluptate velit esse quam.`
