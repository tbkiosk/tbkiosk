import { signOut } from 'next-auth/react'
import Image from 'next/image'
import cl from 'classnames'

import { Dropdown, Button } from '@/components'

import useSessionGuard from '@/hooks/useSessionGuard'

const UserDropdown = () => {
  const { session, status } = useSessionGuard({ ignoreSession: true })

  const renderButton = () => {
    if (session && status === 'authenticated') {
      return (
        <>
          <Image
            alt="avatar"
            className="rounded-full"
            height={32}
            src={session?.user?.image || ''}
            width={32}
          />
          <span className="mx-4 truncate">{session?.user?.name}</span>
        </>
      )
    }

    return <span className="mr-4">Login</span>
  }

  if (status === 'unauthenticated') {
    return (
      <Button className="!w-auto" variant="contained">
        <span className="mx-4">Not logged in</span>
      </Button>
    )
  }

  return (
    <Dropdown renderButton={renderButton}>
      <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {session && status === 'authenticated' && (
          <Dropdown.Item>
            {({ active }) => (
              <button
                className={cl(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full px-4 py-4 text-left text-sm '
                )}
                onClick={() => signOut()}
              >
                Sign out
              </button>
            )}
          </Dropdown.Item>
        )}
      </Dropdown.Items>
    </Dropdown>
  )
}

export default UserDropdown
