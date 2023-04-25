import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import dayjs from 'dayjs'

import Layout from '@/layouts'
import { Loading } from '@/components'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'
import { CriteriaKeys } from '@/schemas/allowlist'

import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import type { AllowlistPreviewData } from '@/schemas/allowlist'
import type { WithObjectId } from '@/types/schema'

const DiscoverProjectDetail = () => {
  const router = useRouter()

  const { data: { data: project = null } = {}, isLoading: isProjectsLoading } = useSWR<ResponseBase<WithObjectId<ProjectData>>>(
    router.query.projectId ? `/api/discover/${router.query.projectId}` : null
  )
  const { data: { data: allowlists = null } = {}, isLoading: isAllowlistLoading } = useSWR<
    ResponseBase<WithObjectId<AllowlistPreviewData>[]>
  >(router.query.projectId ? `/api/discover/${router.query.projectId}/allowlist` : null)

  const [open, setOpen] = useState(false)

  return (
    <Layout
      headerLeft={
        <>
          <Link href="/project">
            <i className="fa-solid fa-arrow-left-long text-2xl mr-4 cursor-pointer transition hover:opacity-70 hover:scale-110" />
          </Link>
          <span>Back</span>
        </>
      }
    >
      <div className="h-[14.5rem] mb-8">
        <Loading isLoading={isProjectsLoading}>
          {project && (
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
              <div className="w-64 max-w-64 flex flex-col gap-2">
                <p className="mb-4 font-bold text-2xl truncate">{project.projectName}</p>
                <p className="mb-4 flex gap-2">
                  <span className="py-0.5 flex-1 bg-[#e8e8ff] text-center text-sm rounded-2xl">
                    <i className="fa-brands fa-twitter mr-2" />
                    <span className="font-bold">-</span>
                  </span>
                  <span className="py-0.5 flex-1 bg-[#e8e8ff] text-center text-sm rounded-2xl">
                    <i className="fa-brands fa-discord mr-2" />
                    <span className="font-bold">-</span>
                  </span>
                </p>
                <p className="flex justify-between">
                  <span>Supply</span>
                  <span className="font-bold">{project.totalSupply ?? '-'}</span>
                </p>
                <p className="flex justify-between">
                  <span>Mint date</span>
                  <span className="font-bold">{dayjs(project.mintDate).format('DD MMM YYYY')}</span>
                </p>
                <p className="flex justify-between">
                  <span>Price</span>
                  <span className="font-bold">
                    {project.mintPrice ?? '-'} {project.coinType}
                  </span>
                </p>
              </div>
            </div>
          )}
        </Loading>
      </div>
      <div className="flex flex-wrap gap-x-4">
        <Loading isLoading={isAllowlistLoading}>
          <>
            {allowlists?.map(_allowlist => (
              <div
                className="w-1/3 min-w-[17.5rem] flex flex-col p-8 rounded-2xl shadow-[0_4px_10px_rgba(216,216,216,0.25)] cursor-pointer transition hover:scale-105"
                key={_allowlist._id}
              >
                <span className="self-end px-6 mb-2 bg-[#82ffac] font-bold rounded-2xl">Live</span>
                <p className="font-bold text-lg truncate">
                  {_allowlist.amount} allowlist {_allowlist.allocationMethod}
                </p>
                <hr className="-mx-8 my-6" />
                {!Object.keys(_allowlist.criteria)?.length && <p className="text-gray-300">No criteria</p>}
                {Object.entries(_allowlist.criteria).map(([_criteria, _content]) => (
                  <div key={_criteria}>{}</div>
                ))}
                <hr className="-mx-8 my-6" />
                <p className="font-bold">
                  {_allowlist.filled}/{_allowlist.amount} filled
                </p>
              </div>
            ))}
          </>
        </Loading>
      </div>
    </Layout>
  )
}

export default DiscoverProjectDetail
