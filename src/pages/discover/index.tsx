import { useEffect } from 'react'
import { toast } from 'react-toastify'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

import Layout from '@/layouts'
import { Loading } from '@/components'

import { TENCENT_COS_DEV_BUCKET, TENCENT_COS_BUCKET, TENCENT_COS_CDN_DOMAIN } from '@/constants/cos'

import type { ResponseBase } from '@/types/response'
import type { WithObjectId } from '@/types/schema'
import type { ProjectBase } from '@/schemas/project'
import type { AllowlistRawData } from '@/schemas/allowlist'

const Discover = () => {
  const {
    data: { data: allowlistsWithProjectInfo = [] } = {},
    isLoading,
    error,
  } = useSWR<ResponseBase<(WithObjectId<AllowlistRawData> & { project: ProjectBase })[]>>('/api/discover')

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load discover')
    }
  }, [error])

  return (
    <>
      <Head>
        <title>Morphis Network - Discover</title>
        <meta
          name="description"
          content="morphis network discover"
        />
      </Head>
      <Layout>
        <Loading isLoading={isLoading}>
          <div className="flex flex-col gap-4">
            {allowlistsWithProjectInfo.map(_allowlist => (
              <Link
                className="relative p-4 rounded-lg shadow-[0_4px_10px_rgba(175,175,175,0.25)] cursor-pointer transition-transform hover:scale-[1.003]"
                href={`/discover/${_allowlist._id}`}
                key={_allowlist._id}
              >
                <span className="absolute right-4 top-2 px-3 bg-[#fff3ec] text-[#9c9d9e] rounded-3xl">
                  {_allowlist.project.projectType}
                </span>
                <div className="flex items-center gap-4 mb-2">
                  <Image
                    alt="logo"
                    className="w-8 h-8 rounded-full aspect-square object-contain"
                    height={32}
                    loader={({ src }) => src}
                    src={`https://${
                      process.env.NODE_ENV === 'production' ? TENCENT_COS_BUCKET : TENCENT_COS_DEV_BUCKET
                    }.${TENCENT_COS_CDN_DOMAIN}/${_allowlist.project.profileImage}`}
                    unoptimized
                    width={32}
                  />
                  <span className="font-bold text-xl truncate">{_allowlist.project.projectName}</span>
                </div>
                <div className="font-medium text-lg">{_allowlist.project.description}</div>
              </Link>
            ))}
          </div>
        </Loading>
      </Layout>
    </>
  )
}

export default Discover
