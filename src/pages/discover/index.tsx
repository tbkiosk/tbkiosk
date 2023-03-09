import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'

import Layout from '@/layouts'
import { Loading, Button, CCSignInButton } from '@/components'
import CCPrimaryProfile from '@/components/_discover/cc_primary_profile'
import CCAccountList from '@/components/_discover/cc_account_list'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

import { PRIMARY_PROFILE } from '@/graphql'

const Discover = () => {
  const { address, accessToken, setPrimaryProfile } = useContext(CyberConnectAuthContext)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE)

  const [primaryProfileLoading, setPrimaryProfileLoading] = useState(false)

  useEffect(() => {
    if (!address || !accessToken) {
      return
    }

    const getProfiles = async () => {
      setPrimaryProfileLoading(true)
      try {
        const { data } = await getPrimaryProfile({
          variables: {
            address,
          },
        })

        setPrimaryProfile(data?.address?.wallet?.primaryProfile)
      } catch (err) {
        toast.error((err as Error)?.message || 'Failed to load profile')
      } finally {
        setPrimaryProfileLoading(false)
      }
    }

    if (accessToken && address) {
      getProfiles()
    }
  }, [accessToken, address, getPrimaryProfile])

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
        <div className="flex flex-col grow">
          <Loading isLoading={primaryProfileLoading}>
            <>
              {(!address || !accessToken) && (
                <div className="flex flex-col items-center justify-center gap-8">
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
              )}
              <CCPrimaryProfile />
              {address && accessToken && <CCAccountList />}
            </>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Discover
