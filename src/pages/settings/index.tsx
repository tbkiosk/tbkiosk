import { useMemo } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { signIn } from 'next-auth/react'

import Layout from '@/layouts'
import { Loading, Button } from '@/components'
import NewETHButton from '@/components/__settings__/new_eth_button'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'
import { useUser } from '@/hooks/api/useUser'

const Settings = () => {
  const { status } = useSessionGuard()
  const { data, isLoading, refetch } = useUser({
    enabled: status === 'authenticated',
    onError: error => {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }

      if (typeof error === 'string') {
        toast.error(error)
        return
      }
    },
  })

  const ethAccounts = useMemo(() => data?.accounts?.filter(_account => _account.provider === 'Ethereum'), [data?.accounts])
  const twitterAccount = useMemo(() => data?.accounts?.find(_account => _account.provider === 'twitter'), [data?.accounts])
  const discordAccount = useMemo(() => data?.accounts?.find(_account => _account.provider === 'discord'), [data?.accounts])

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
                {ethAccounts?.map(_account => (
                  <div key={_account.id}>
                    {_account.isPrimary && <div>Primary</div>}
                    <div className="">{_account.provider}</div>
                    <div className="">{_account.providerAccountId}</div>
                  </div>
                ))}
                <NewETHButton onRefresh={() => refetch()} />
              </div>
              <div>
                <p className="font-bold">Twitter</p>
                {!twitterAccount && (
                  <Button
                    className="!h-8 !w-auto"
                    onClick={() => signIn('twitter', { callbackUrl: '/settings' })}
                    variant="outlined"
                  >
                    Link Twitter
                  </Button>
                )}
                {twitterAccount && (
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{twitterAccount?.providerAccountName}
                  </a>
                )}
              </div>
              <div>
                <p className="font-bold">Discord</p>
                {!discordAccount && (
                  <Button
                    className="!h-8 !w-auto"
                    onClick={() => signIn('discord', { callbackUrl: '/settings' })}
                    variant="outlined"
                  >
                    Link Discord
                  </Button>
                )}
                {discordAccount && (
                  <a
                    href="https://discord.com/app"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @{discordAccount?.providerAccountName}
                  </a>
                )}
              </div>
            </>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
