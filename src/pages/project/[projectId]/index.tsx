import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import dayjs from 'dayjs'
import cl from 'classnames'
import { Tab } from '@headlessui/react'

import Layout from '@/layouts'
import { Loading, Button } from '@/components'
import { AllowlistDialog } from '@/components/_project/allowlist_dialog'
import { AllowlistApplicationDialog } from '@/components/_project/allowlist_application_dialog'
import { CriteriaList } from '@/components/_shared/criteria_list'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'

import type { ResponseBase } from '@/types/response'
import type { ProjectData } from '@/schemas/project'
import { AllowlistRawData } from '@/schemas/allowlist'
import type { WithObjectId } from '@/types/schema'

const ProjectDetail = () => {
  const router = useRouter()

  const { data: { data: project = null } = {}, isLoading: isProjectsLoading } = useSWR<ResponseBase<WithObjectId<ProjectData>>>(
    router.query.projectId ? `/api/project/${router.query.projectId}` : null
  )
  const {
    data: { data: allowlists = null } = {},
    isLoading: isAllowlistLoading,
    mutate,
  } = useSWR<ResponseBase<WithObjectId<AllowlistRawData>[]>>(
    router.query.projectId ? `/api/project/${router.query.projectId}/allowlist` : null
  )

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
        <AllowlistDialog
          open={router.query.allowlistId === 'new'}
          setOpen={(nextOpen: boolean) => router.push(`/project/${router.query.projectId}${nextOpen ? '?allowlistId=new' : ''}`)}
          project={project}
          onRefresh={() => mutate()}
        />
        <AllowlistApplicationDialog
          open={!!router.query.allowlistId && router.query.allowlistId !== 'new'}
          setOpen={nextOpen => !nextOpen && router.push(`/project/${router.query.projectId}`)}
        />
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
              <div className="w-64 max-w-64 flex flex-col">
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
                <div className="grow" />
                <Button
                  className="block !h-10 mb-2"
                  onClick={() => router.push(`/project/${router.query.projectId}?allowlistId=new`)}
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
              <div>
                <Link
                  className="block cursor-pointer transition hover:scale-105 hover:opacity-70"
                  href={`/project/${router.query.projectId}/update`}
                >
                  <span>Edit</span>
                  <i className="fa-solid fa-pencil ml-2" />
                </Link>
              </div>
            </div>
          )}
        </Loading>
      </div>
      <div className="flex flex-col gap-4 min-h-[12rem]">
        <Loading isLoading={isAllowlistLoading}>
          <Tab.Group>
            <Tab.List>
              <Tab>
                {({ selected }) => (
                  <span className={cl(['px-4 py-1 transition-opacity hover:opacity-50', selected && 'font-bold border-b border-b-black'])}>
                    My lists
                  </span>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="outline-none">
                <div className="flex flex-wrap gap-4">
                  {allowlists?.map(_allowlist => (
                    <div
                      className="w-[calc(33.33%_-_1rem)] min-w-[17.5rem] max-h-[20rem] flex flex-col p-8 rounded-2xl shadow-[0_4px_10px_rgba(216,216,216,0.25)] overflow-y-auto cursor-pointer transition-transform hover:scale-[1.01]"
                      key={_allowlist._id}
                      onClick={() => router.push(`/project/${router.query.projectId}?allowlistId=${_allowlist._id}`)}
                    >
                      <span className="self-end px-6 mb-2 bg-[#82ffac] font-bold rounded-2xl">Live</span>
                      <p className="shrink-0 font-bold text-lg truncate">
                        {_allowlist.amount} allowlist {_allowlist.allocationMethod}
                      </p>
                      <hr className="-mx-8 my-6" />
                      <CriteriaList
                        criteria={_allowlist.criteria}
                        projectName={project?.projectName}
                      />
                      <hr className="-mx-8 my-6" />
                      <p className="font-bold">
                        {_allowlist.approvees.length}/{_allowlist.amount} filled
                      </p>
                    </div>
                  ))}
                  {!allowlists?.length && <p className="w-full mt-12 text-center text-gray-400">No lists</p>}
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Loading>
      </div>
    </Layout>
  )
}

export default ProjectDetail
