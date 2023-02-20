import Head from 'next/head'
// import { useSession } from 'next-auth/react'

import Layout from '@/layouts'

const Profile = () => {
  // const { status } = useSession()

  return (
    <>
      <Head>
        <title>Morphis Network - Profile</title>
        <meta name="description" content="morphis network profile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>profile</Layout>
    </>
  )
}

export default Profile
