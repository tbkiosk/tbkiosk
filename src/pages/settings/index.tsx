import { useEffect } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'

import Layout from '@/layouts'
import { Loading } from '@/components'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'
import { useUser } from '@/hooks/api/useUser'

const Settings = () => {
  const { status } = useSessionGuard()
  const { data, isLoading, error, isError } = useUser({ enabled: status === 'authenticated' })

  useEffect(() => {
    if (isError) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }

      if (typeof error === 'string') {
        toast.error(error)
        return
      }
    }
  }, [isError])

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
            <>
              {data?.accounts.map(_account => (
                <div key={_account.id}>
                  {_account.isPrimary && <div>Primary</div>}
                  <div className="">{_account.provider}</div>
                  <div className="">{_account.providerAccountId}</div>
                </div>
              ))}
            </>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
