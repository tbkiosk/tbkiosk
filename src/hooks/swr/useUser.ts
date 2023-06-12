import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useSWRImmutable from 'swr/immutable'

import type { ResponseBase } from '@/types/response'
import type { UserResponse } from '@/pages/api/user'

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWRImmutable<ResponseBase<UserResponse>>({ url: '/api/user' })

  useEffect(() => {
    if (error) {
      toast.error(error?.message || 'Failed to load user information')
    }
  }, [error])

  return {
    data: data?.data,
    isLoading,
    error: error || data?.message,
    mutate,
  }
}
