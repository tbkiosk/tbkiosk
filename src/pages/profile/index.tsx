import Head from 'next/head'
import { useLocalStorage } from 'usehooks-ts'

import Layout from '@/layouts'
import ProfileCard from '@/components/_profile/profile_card'
import Balances from '@/components/_profile/balances'
import Collections from '@/components/_profile/collections'
import Connections from '@/components/_profile/connections'

import { ROLES } from '@/types/roles'

const UserRoleProfile = () => (
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
)

const CreatorRoleProfile = () => <div>test123</div>

const Profile = () => {
  const [role] = useLocalStorage('morphis_role', ROLES.USER)

  return (
    <>
      <Head>
        <title>Morphis Network - Profile</title>
        <meta
          name="description"
          content="morphis network profile"
        />
      </Head>
      <Layout>
        {role === ROLES.USER && <UserRoleProfile />}
        {role === ROLES.CREATOR && <CreatorRoleProfile />}
      </Layout>
    </>
  )
}

export default Profile
