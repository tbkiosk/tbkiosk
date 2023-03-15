import cl from 'classnames'
import { useSession } from 'next-auth/react'

import { Tooltip, Loading } from '@/components'

import useUser from '@/hooks/swr/useUser'

const ConnectStatusBase = () => {
  const { data, isLoading } = useUser()

  return (
    <Loading isLoading={isLoading}>
      <div className="flex gap-4 mr-4">
        <Tooltip
          position="bottom"
          tip={data?.discordEmail}
        >
          <span
            className={cl([
              'h-12 min-w-[3rem] flex shrink-0 items-center justify-center bg-[#fdede5] rounded-[3rem] cursor-pointer',
              'transition-opacity hover:opacity-80',
              !data?.discordEmail && 'px-4 !bg-[#d9d9d9]',
            ])}
          >
            <i className="fa-brands fa-discord fa-xl" />
            {!data?.discordEmail && <i className="fa-solid fa-plus fa-sm ml-2" />}
          </span>
        </Tooltip>
        <Tooltip
          position="bottom"
          tip="Coming soon"
        >
          <span
            className={cl([
              'h-12 min-w-[3rem] flex shrink-0 items-center justify-center bg-[#fdede5] rounded-[3rem] cursor-pointer',
              'transition-opacity hover:opacity-80',
              !data?.twitterEmail && 'px-4 !bg-[#d9d9d9]',
            ])}
          >
            <i className="fa-brands fa-twitter fa-xl" />
            {!data?.twitterEmail && <i className="fa-solid fa-plus fa-sm ml-2" />}
          </span>
        </Tooltip>
      </div>
    </Loading>
  )
}

const ConnectStatusWrapper = () => {
  const { status } = useSession()

  return (
    <Loading isLoading={status === 'loading'}>
      <ConnectStatusBase />
    </Loading>
  )
}

export default ConnectStatusWrapper
