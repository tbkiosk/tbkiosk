import Head from 'next/head'

import Layout from '@/layouts'
import WalletConnectModal from '@/components/__shared__/wallet_connect_modal'

const Login = () => {
  return (
    <>
      <Head>
        <title>Morphis Airdawg - Login</title>
        <meta
          name="description"
          content="Morphis Airdawg login"
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
