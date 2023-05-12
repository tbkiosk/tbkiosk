import useSWRImmutable from 'swr/immutable'

import type { User } from 'next-auth'
import type { ResponseBase } from '@/types/response'

const useUser = () => {
  const { data, error, isLoading, mutate } = useSWRImmutable<ResponseBase<User>>('/api/user')

  return {
    data: data?.data,
    isLoading,
    error: error || data?.message,
    mutate,
  }
}

export default useUser
