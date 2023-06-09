import Head from 'next/head'
import { useSession } from 'next-auth/react'

import Layout from '@/layouts'

const Discover = () => {
  const session = useSession()

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
