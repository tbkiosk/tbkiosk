import Image from 'next/image'

import { Loading } from '@/components'

import useSessionGuard from '@/hooks/useSessionGuard'
import useDiscordGuilds from '@/hooks/swr/useDiscordGuilds'

const ProfileCard = () => {
  const { session } = useSessionGuard({ ignoreSession: true })
  const { data, isLoading } = useDiscordGuilds()

  return (
    <div className="flex flex-row grow gap-4 h-[200px] px-9 py-3 rounded-[20px] shadow-[0_4px_10px_rgba(216,216,216,0.25)] overflow-hidden">
      <div className="flex flex-1 flex-row overflow-hidden">
        <Image
          alt="avatar"
          className="h-[160px] rounded-full"
          height={160}
          src={session?.user?.image || ''}
          width={160}
        />
        <div className="flex flex-col justify-center gap-10 ml-[60px] overflow-hidden">
          <span className="font-bold text-4xl truncate">
            {session?.user?.name}
          </span>
          <div>
            <i className="fa-brands fa-twitter fa-2xl mr-4" />
            <i className="fa-brands fa-discord fa-2xl" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-10 overflow-hidden">
        <span className="font-bold text-2xl">My communities</span>
        <div className="flex flex-row">
          <Loading isLoading={isLoading}>
            <div className="flex flex-row gap-2 items-center">
              {data?.slice(0, 3).map((guild) => (
                <Image
                  alt={guild.name}
                  className="rounded-[10px]"
                  height={60}
                  key={guild.id}
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=64`}
                  width={60}
                />
              ))}
              {data?.length && data.length > 3 && (
                <span className="text-2xl">{`+${data.length - 3}`}</span>
              )}
            </div>
          </Loading>
        </div>
      </div>
    </div>
  )
}

const ProfileCardWrapper = () => {
  const { status } = useSessionGuard({ ignoreSession: true })

  if (status === 'unauthenticated') {
    return null
  }

  return <ProfileCard />
}

export default ProfileCardWrapper
