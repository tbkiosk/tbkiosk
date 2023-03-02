import Head from 'next/head'

import Layout from '@/layouts'
import ProfileCard from './components/profile_card'
import Balances from './components/balances'
import Collections from './components/collections'
import Connections from './components/connections'

const Profile = () => {
  return (
    <>
      <Head>
        <title>Morphis Network - Profile</title>
        <meta name="description" content="morphis network profile" />
      </Head>
      <Layout>
        <div className="grid grow grid-rows-[200px_150px_1fr] grid-cols-[1fr_320px] gap-6 pb-[54px]">
          <div className="col-span-2">
            <ProfileCard />
          </div>
          <div className="col-span-1 ">
            <Balances />
          </div>
          <div className="col-span-1 row-span-2">
            <Connections />
          </div>
          <div className="">
            <Collections />
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Profile
