import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import Layout from '@/layouts'
import { Button, Loading } from '@/components'

import useRole from '@/hooks/useRole'

import request from '@/utils/request'

import { ROLES } from '@/constants/roles'

import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'

type ProjectDataWithId = ProjectData & { _id: string }

const Project = () => {
  const router = useRouter()

  const [role] = useRole()

  const [projects, setProjects] = useState<ProjectDataWithId[]>([])
  const [loading, setLoading] = useState(false)

  const onLoadProjects = async () => {
    setLoading(true)

    const { data } = await request<ResponseBase<ProjectDataWithId[]>>('/api/project')

    setProjects(data.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    if (role === ROLES.USER) {
      router.push('/profile')
      return
    }

    onLoadProjects()
  }, [role])

  return (
    <Layout>
      <Loading isLoading={loading}>
        <div className="flex flex-col justify-center items-center grow">
          {!projects.length ? (
            <>
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
            </>
          ) : (
            <>
              <div className="w-full flex items-center justify-between py-4">
                <div className="font-bold text-lg">{`${projects.length} Project${projects.length > 1 ? 's' : ''}`}</div>
                <Button
                  className="!h-10 !w-auto px-8"
                  variant="colored"
                >
                  Create a new project
                </Button>
              </div>
              <div className="w-full grow grid 2xl:grid-cols-6 lg:grid-cols-4 grid-cols-3 auto-rows-min gap-4">
                {projects.map(_project => (
                  <div
                    className="p-4 shadow-[0_4px_10px_rgba(175,175,175,0.25)] cursor-pointer transition-transform hover:scale-105"
                    key={_project._id}
                  >
                    <Image
                      alt="logo"
                      className="rounded-lg object-cover"
                      height={256}
                      src="/icons/logo.svg"
                      width={256}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="truncate">{_project.projectName}</div>
                      <div className="shrink-0 px-4 py-1 ml-2 rounded-[1.875rem] bg-[#82ffac]">Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Loading>
    </Layout>
  )
}

export default Project
