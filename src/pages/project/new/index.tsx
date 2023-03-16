import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from '@/layouts'

import useRole from '@/hooks/useRole'

import { ROLES } from '@/constants/roles'

const NewProject = () => {
  const router = useRouter()

  const [role] = useRole()

  useEffect(() => {
    if (role === ROLES.USER) {
      router.push('/profile')
    }
  }, [role])

  return (
    <Layout showHeader={false}>
      <div className="flex flex-col justify-center items-center grow">new</div>
    </Layout>
  )
}

export default NewProject
