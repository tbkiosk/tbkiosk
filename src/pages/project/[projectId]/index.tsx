import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'

import Layout from '@/layouts'
import { Loading } from '@/components'

import type { ResponseBase } from '@/types/response'
import type { ProjectDataWithId } from '@/schemas/project'

const ProjectDetail = () => {
  const router = useRouter()

  const { data: { data: project = null } = {}, isLoading } = useSWR<ResponseBase<ProjectDataWithId>>(
    `/api/project/${router.query.projectId}`
  )

  return (
    <Layout
      headerLeft={
        <Link
          className="flex items-center"
          href="/project"
        >
          <i className="fa-solid fa-arrow-left-long text-2xl mr-4 cursor-pointer transition hover:opacity-70 hover:scale-110" />
          <span>Back</span>
        </Link>
      }
    >
      <Loading isLoading={isLoading}>{project && <div>{project.projectName}</div>}</Loading>
    </Layout>
  )
}

export default ProjectDetail
