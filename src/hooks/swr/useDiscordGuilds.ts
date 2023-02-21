import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import useSWRImmutable from 'swr/immutable'

import fetcher from '@/helpers/swr/fetcher'

import type { ExtendedSession } from '@/helpers/nextauth/types'

type DiscordGuilds = {
  id: string
  name: string
  icon: string | null
}

const useDiscordGuilds = () => {
  const { data: session } = useSession()
  const { data, error, isLoading, mutate } = useSWRImmutable<DiscordGuilds[]>(
    [
      'https://discord.com/api/v10/users/@me/guilds',
      {
        headers: {
          Authorization: `Bearer ${(session as ExtendedSession).accessToken}`,
        },
      },
    ],
    ([resource, options]: [RequestInfo, RequestInit]) =>
      fetcher<DiscordGuilds[]>(resource, options)
  )

  useEffect(() => {
    if (error) {
      toast((error as Error)?.message || 'Failed to load user discord guilds')
    }
  }, [error])

  return {
    data: data,
    isLoading,
    error: error,
    mutate,
  }
}

export default useDiscordGuilds
