import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

type SessionGuardOptions = {
  ignoreSession?: boolean
  authorizedRedirectPath?: string
}

export const useSessionGuard = (options?: SessionGuardOptions) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && status !== 'loading' && !options?.ignoreSession) {
      router.push('/login')
      return
    }

    if (session?.user && options?.authorizedRedirectPath) {
      router.push(options.authorizedRedirectPath)
      return
    }
  }, [session, router, status, options?.ignoreSession])

  return { session, status }
}
