import { useRouter } from 'next/router'
import Head from 'next/head'

import Layout from '@/layouts'
import WalletConnectModal from '@/components/_shared/wallet_connect_modal'

const Login = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Airdawg - Login</title>
        <meta
          name="description"
          content="morphis network Airdawg"
        />
      </Head>
      <Layout className="blur-sm">
        <WalletConnectModal
          open={true}
          setOpen={() => null}
        />
      </Layout>
    </>
  )
}

export default Login
