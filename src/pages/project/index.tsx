import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/layouts'
import { Button } from '@/components'

import useRole from '@/hooks/useRole'

import { ROLES } from '@/constants/roles'

const Project = () => {
  const router = useRouter()

  const [role] = useRole()

  useEffect(() => {
    if (role === ROLES.USER) {
      router.push('/profile')
    }
  }, [role])

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center grow">
        <Image
          alt="no-project"
          className="mb-4"
          height={274}
          src="/images/no_project.svg"
          width={251}
        />
        <p className="mb-4 text-xl font-bold">You do not have any projects yet</p>
        <Link href="/project/new">
          <Button
            className="!h-12 px-8"
            variant="colored"
          >
            Create a new project
          </Button>
        </Link>
      </div>
    </Layout>
  )
}

export default Project
