import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { request } from '@/utils/request'

export const useUser = <T>(config?: Partial<UseQueryOptions>) => {
  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data, error } = await request<T>({
        url: '/api/user',
        method: 'PUT',
      })

      if (error) {
        throw new Error(error)
      }

      return data
    },
    retry: false,
    ...config,
  })

  return query
}
