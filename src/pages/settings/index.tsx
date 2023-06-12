import Head from 'next/head'

import Layout from '@/layouts'
import { Loading } from '@/components'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'
import { useUser } from '@/hooks/swr/useUser'

const Settings = () => {
  useSessionGuard()
  const { isLoading } = useUser()

  return (
    <>
      <Head>
        <title>Morphis Airdawg - Settings</title>
        <meta
          name="description"
          content="Morphis Airdawg settings"
        />
      </Head>
      <Layout>
        <div className="min-h-[540px] flex flex-col">
          <Loading isLoading={isLoading}>
            <p>123</p>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
