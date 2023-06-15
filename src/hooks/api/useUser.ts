import { useQuery } from '@tanstack/react-query'

import { request } from '@/utils/request'

import type { UseQueryOptions } from '@tanstack/react-query'
import type { UserResponse } from '@/pages/api/user'

export const useUser = (options?: Partial<UseQueryOptions<UserResponse | undefined, Error>>) =>
  useQuery<UserResponse | undefined, Error>({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await request<UserResponse>({
        url: '/api/user',
      })

      if (error) {
        throw new Error(error)
      }

      return data
    },
    retry: false,
    ...options,
  })
