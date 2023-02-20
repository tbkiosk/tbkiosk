import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useWallet } from '@suiet/wallet-kit'
import cl from 'classnames'

import { Dropdown } from '@/components'

import { ellipsisMiddle } from '@/utils/address'

const UserDropdown = () => {
  const { data: session, status } = useSession()
  const { connected, address } = useWallet()

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

    if (connected && address) {
      return <span className="mx-4">{ellipsisMiddle(address)}</span>
    }

    return <span>Not connected</span>
  }

  return (
    <Dropdown renderButton={renderButton}>
      <Dropdown.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {status === 'unauthenticated' && (
          <Dropdown.Item>
            {({ active }) => (
              <button
                className={cl(
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full px-4 py-4 text-left text-sm '
                )}
                onClick={() => signIn()}
              >
                Disconnect
              </button>
            )}
          </Dropdown.Item>
        )}
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
