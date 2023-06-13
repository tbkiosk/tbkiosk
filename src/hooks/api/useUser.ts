import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { request } from '@/utils/request'

export const useUser = (config?: Partial<UseQueryOptions>) => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, message, status } = await request({
        url: '/api/user',
      })

      if (!status || status >= 400) {
        throw new Error(message)
      }

      return data
    },
    retry: false,
    ...config,
  })

  return query
}
