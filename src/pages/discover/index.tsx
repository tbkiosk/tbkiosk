import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'

import Layout from '@/layouts'
import { Loading, Button } from '@/components'
// import CCPrimaryProfile from '@/components/_discover/cc_primary_profile'
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
              <div className="flex justify-between mb-8">
                <div className="flex flex-row gap-12 font-bold text-xl">
                  <nav className="underline cursor-pointer transition-opacity hover:opacity-50">People</nav>
                  <nav className="cursor-not-allowed opacity-50">Communities</nav>
                  <nav className="cursor-not-allowed opacity-50">Opportunities</nav>
                </div>
                <Button className="!w-auto !h-10 px-8 bg-gradient-to-r from-[#e87a5e] to-[#ef7cee] cursor-not-allowed">
                  Follow All
                </Button>
              </div>
              {address && accessToken && <CCAccountList />}
            </>
          </Loading>
        </div>
      </Layout>
    </>
  )
}

export default Discover
