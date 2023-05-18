import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

type SessionGuardOptions = {
  ignoreSession?: boolean
}

const useSessionGuard = (options?: SessionGuardOptions) => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading' && !options?.ignoreSession) return

    if (!session || session.error) {
      router.push('/login')
    }
  }, [session, router, status])

  return { session, status }
}

export default useSessionGuard
