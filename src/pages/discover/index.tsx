import Head from 'next/head'
import { AppShell, Container, Title, rem } from '@mantine/core'

import { UserProvider } from '@/providers/user'

import { Header } from '@/components'

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
        <Title order={4}>Hi</Title>
        <Title order={1}>Discover 📌</Title>
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
