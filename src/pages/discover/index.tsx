import Head from 'next/head'

import Layout from '@/layouts'
import { Button, CCSignInButton } from '@/components'

const Discover = () => {
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
        <div className="flex flex-col">
          <div>
            <CCSignInButton classNames="!w-[12rem] mr-4" />
            <a
              className="transition-opacity hover:opacity-80"
              href="https://testnet.cyberconnect.me/"
              rel="noreferrer"
              target="_blank"
            >
              <Button
                className="!w-[12rem]"
                variant="contained"
              >
                Mint profile
              </Button>
            </a>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Discover
