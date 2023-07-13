import { createContext } from 'react'
import { LoadingOverlay } from '@mantine/core'

import { useUser } from '@/hooks/api/useUser'
import { useSessionGuard } from '@/hooks/auth/useSessionGuard'

import type { UserResponse } from '@/pages/api/user'
import type { SingleNode } from '@/types/react_node'

const defaultUserState: Partial<UserResponse> & { refetch: () => Promise<unknown> } = {
  id: '',
  address: null,
  name: null,
  image: null,
  emailVerified: null,
  refetch: async () => null,
  accounts: [],
}

export const UserContext = createContext(defaultUserState)

export const UserProvider = ({ children }: SingleNode) => {
  const { status } = useSessionGuard()
  const { data, isLoading, refetch } = useUser({
    enabled: status === 'authenticated',
    onError: error => {
      if (error instanceof Error) {
        return
      }

      if (typeof error === 'string') {
        return
      }
    },
  })

  return (
    <UserContext.Provider value={{ ...data, refetch }}>
      <LoadingOverlay
        inset={0}
        pos="fixed"
        visible={status === 'loading' || isLoading}
      />
      {status !== 'loading' && !isLoading && children}
    </UserContext.Provider>
  )
}
