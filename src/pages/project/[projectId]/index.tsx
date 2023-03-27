import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import dayjs from 'dayjs'

import Layout from '@/layouts'
import { Loading, Button } from '@/components'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'

import type { ResponseBase } from '@/types/response'
import type { ProjectDataWithId } from '@/schemas/project'

const ProjectDetail = () => {
  const router = useRouter()

  const { data: { data: project = null } = {}, isLoading } = useSWR<ResponseBase<ProjectDataWithId>>(
    router.query.projectId ? `/api/project/${router.query.projectId}` : null
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
      <Loading isLoading={isLoading}>
        {project && (
          <div>
            <div className="flex gap-8">
              <Image
                alt="logo"
                className="h-[14.5rem] rounded-lg aspect-square object-contain"
                height={232}
                loader={({ src }) => src}
                src={`https://${
                  process.env.NODE_ENV === 'production' ? TENCENT_COS_BUCKET : TENCENT_COS_DEV_BUCKET
                }.${TENCENT_COS_CDN_DOMAIN}/${project.profileImage}`}
                unoptimized
                width={232}
              />
              <div className="w-64 max-w-64 flex flex-col">
                <p className="mb-4 font-bold text-2xl truncate">{project.projectName}</p>
                <p className="mb-4 flex gap-2">
                  <span className="py-0.5 flex-1 bg-[#e8e8ff] text-center text-sm rounded-2xl">
                    <i className="fa-brands fa-twitter mr-2" />
                    <span className="font-bold">85k</span>
                  </span>
                  <span className="py-0.5 flex-1 bg-[#e8e8ff] text-center text-sm rounded-2xl">
                    <i className="fa-brands fa-discord mr-2" />
                    <span className="font-bold">135k</span>
                  </span>
                </p>
                <div className="grow" />
                <Button
                  className="block !h-10 mb-2"
                  variant="colored"
                >
                  Create new allowlist
                </Button>
                <Button
                  className="block !h-10"
                  variant="outlined"
                >
                  Applications
                </Button>
              </div>
              <div className="w-56 max-w-56 flex flex-col gap-2">
                <p className="flex justify-between">
                  <span>Supply</span>
                  <span className="font-bold">{project.totalSupply}</span>
                </p>
                <p className="flex justify-between">
                  <span>Mint date</span>
                  <span className="font-bold">{dayjs(project.mintDate).format('DD MMM YYYY')}</span>
                </p>
                <p className="flex justify-between">
                  <span>Price</span>
                  <span className="font-bold">{project.mintPrice}</span>
                </p>
              </div>
              <Link
                className="ml-8"
                href={`/project/${router.query.projectId}/edit`}
              >
                <div className="cursor-pointer transition hover:scale-105 hover:opacity-70">
                  <span>Edit</span>
                  <i className="fa-solid fa-pencil ml-2" />
                </div>
              </Link>
            </div>
          </div>
        )}
      </Loading>
    </Layout>
  )
}

export default ProjectDetail
