import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'

import Layout from '@/layouts'
import { Loading } from '@/components'
import { TwitterButton } from '@/components/__settings__/twitter_button'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'
import { useUser } from '@/hooks/api/useUser'

const Settings = () => {
  const { status } = useSessionGuard()
  const { data, isLoading, error, isError } = useUser({ enabled: status === 'authenticated' })

  const twitterAccount = useMemo(() => data?.accounts?.find(_account => _account.provider === 'twitter'), [data?.accounts])

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
              <div>
                <p className="font-bold">Ethereum accounts</p>
                {data?.accounts
                  ?.filter(_account => _account.provider === 'Ethereum')
                  ?.map(_account => (
                    <div key={_account.id}>
                      {_account.isPrimary && <div>Primary</div>}
                      <div className="">{_account.provider}</div>
                      <div className="">{_account.providerAccountId}</div>
                    </div>
                  ))}
              </div>
              <div>
                <p className="font-bold">Twitter</p>
                <TwitterButton twitterAccount={twitterAccount} />
              </div>
            </>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
