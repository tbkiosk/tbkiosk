import { useMemo } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { signIn } from 'next-auth/react'

import Layout from '@/layouts'
import { Loading, Button } from '@/components'
import NewETHButton from '@/components/__settings__/new_eth_button'
import DisconnectButton from '@/components/__settings__/disconnect_button'

import { useSessionGuard } from '@/hooks/auth/useSessionGuard'
import { useUser } from '@/hooks/api/useUser'

import { ellipsisMiddle } from '@/utils/address'

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
        <div className="min-h-[540px] min-w-[1180px] flex flex-col py-10 overflow-x-auto">
          <Loading isLoading={isLoading}>
            <div className="relative">
              <p className="font-medium text-2xl">Manage your socials and wallets,</p>
              <p className="mb-10 font-semibold text-[44px]">Settings ⚙️</p>
              <div className="max-w-[600px] p-10 mb-10 border border-[#E2E2EA] rounded-3xl">
                <p className="mb-10 font-medium text-2xl text-[#040607}">Socials</p>
                <div className="flex items-center p-6 mb-10 border border-[#E2E2EA] rounded-3xl">
                  <i className="fa-brands fa-discord mr-4 text-[21px] text-[#687EC9]" />
                  {discordAccount?.providerAccountName ? (
                    <>
                      <a
                        className="grow mr-4 text-[#07070B]"
                        href="https://discord.com/app"
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{discordAccount.providerAccountName}
                      </a>
                      <DisconnectButton
                        account={discordAccount}
                        onRefresh={() => refetch()}
                      />
                    </>
                  ) : (
                    <>
                      <span className="grow mr-4 text-[#B5B5BE]">Add Discord</span>
                      <Button
                        className="!text-[#0062FF] !w-auto !h-6 !border-0 !bg-white"
                        onClick={() => signIn('discord', { callbackUrl: '/settings' })}
                      >
                        Add
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center p-6 mb-10 border border-[#E2E2EA] rounded-3xl">
                  <i className="fa-brands fa-twitter mr-4 text-[21px] text-[#47ACDF]" />
                  {twitterAccount?.providerAccountName ? (
                    <>
                      <a
                        className="grow mr-4 text-[#07070B]"
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        @{twitterAccount.providerAccountName}
                      </a>
                      <DisconnectButton
                        account={twitterAccount}
                        onRefresh={() => refetch()}
                      />
                    </>
                  ) : (
                    <>
                      <span className="grow mr-4 text-[#B5B5BE]">Add Twitter</span>
                      <Button
                        className="!text-[#0062FF] !w-auto !h-6 !border-0 !bg-white"
                        onClick={() => signIn('twitter', { callbackUrl: '/settings' })}
                      >
                        Add
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="max-w-[600px] p-10 border border-[#E2E2EA] rounded-3xl">
                <p className="mb-10 font-medium text-2xl text-[#040607}">Connected wallets</p>
                {ethAccounts?.map(_account => (
                  <div
                    className="flex items-center p-6 mb-10 border border-[#E2E2EA] rounded-3xl"
                    key={_account.providerAccountId}
                  >
                    <i className="fa-brands fa-ethereum mr-4 text-[21px]" />
                    <span className="grow">{ellipsisMiddle(_account.providerAccountId, { startLength: 6, endLength: 5 })}</span>
                    <DisconnectButton
                      account={_account}
                      onRefresh={() => refetch()}
                    />
                  </div>
                ))}
                <NewETHButton onRefresh={() => refetch()} />
              </div>
              <div className="absolute right-0 top-[136px] max-w-[600px] p-10 mb-10 border border-[#E2E2EA] rounded-3xl">
                <p className="mb-10 font-medium text-2xl text-[#040607}">Help centre 🚨</p>
                <p className="text-[#808191]">Having trouble in Airdawg? Please contact us for more question.</p>
                <a className="text-[#0062FF] cursor-pointer">hello@airdawg.io</a>
                <p className="text-[64px]">💌</p>
                <Button
                  className="w-full"
                  variant="colored"
                >
                  Contact us
                </Button>
              </div>
            </div>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Settings
