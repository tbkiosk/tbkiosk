import Head from 'next/head'

import Layout from '@/layouts'

import useSessionGuard from '@/hooks/useSessionGuard'

const Discover = () => {
  useSessionGuard()

  return (
    <>
      <Head>
        <title>Morphis Network - Discover</title>
        <meta
          name="description"
          content="morphis network discover"
        />
      </Head>
      <Layout>
        <div className="flex flex-col grow">Discover</div>
      </Layout>
    </>
  )
}

export default Discover
