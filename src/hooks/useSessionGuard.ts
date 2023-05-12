import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import type { ExtendedSession } from '@/types/nextauth'

type SessionGuardOptions = {
  ignoreSession?: boolean
}

const useSessionGuard = (options?: SessionGuardOptions) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && status !== 'loading' && !options?.ignoreSession) {
      router.push('/')
    }
  }, [session, router, status, options?.ignoreSession])

  return { session: session as ExtendedSession | null, status }
}

export default useSessionGuard
