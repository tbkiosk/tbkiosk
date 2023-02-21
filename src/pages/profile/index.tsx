import Head from 'next/head'

import useSessionGuard from '@/hooks/useSessionGuard'

import Layout from '@/layouts'
import ProfileCard from './components/profile_card'

const Profile = () => {
  const { status } = useSessionGuard({ ignoreSession: true })

  return (
    <>
      <Head>
        <title>Morphis Network - Profile</title>
        <meta name="description" content="morphis network profile" />
      </Head>
      <Layout>
        <div className="flex grow">
          {status === 'unauthenticated' && <span>Not logged in</span>}
          {status === 'authenticated' && (
            <>
              <ProfileCard />
            </>
          )}
        </div>
      </Layout>
    </>
  )
}

export default Profile
