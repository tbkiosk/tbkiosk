import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useSWRImmutable from 'swr/immutable'

import type { ResponseBase } from '@/types/response'
import type { ExtendedUser } from '@/schemas/user'

const useUser = () => {
  const { data, error, isLoading, mutate } =
    useSWRImmutable<ResponseBase<ExtendedUser>>('/api/user')

  useEffect(() => {
    if (error) {
      toast.error((error as Error)?.message || 'Failed to load user')
    }
  }, [error])

  return {
    data: data?.data,
    isLoading,
    error: error || data?.message,
    mutate,
  }
}

export default useUser
