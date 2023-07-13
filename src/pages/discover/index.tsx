import Head from 'next/head'

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
      <h1>discover</h1>
    </>
  )
}

export default Discover
