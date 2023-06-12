import Head from 'next/head'

import Layout from '@/layouts'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'

const Discover = () => {
  useSessionGuard()

  return (
    <>
      <Head>
        <title>Morphis Airdawg - Discover</title>
        <meta
          name="description"
          content="Morphis Airdawg discover"
        />
      </Head>
      <Layout>
        <h1>discover</h1>
      </Layout>
    </>
  )
}

export default Discover
