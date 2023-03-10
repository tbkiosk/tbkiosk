import { useContext } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import cl from 'classnames'

import { Button, Tooltip, CCSignInButton } from '@/components'
import WalletDropdown from '@/layouts/components/wallet_dropdown'

import { CyberConnectAuthContext } from '@/context/cyberconnect_auth'

const Login = () => {
  const { data: session } = useSession()
  const { address, accessToken } = useContext(CyberConnectAuthContext)

  return (
    <>
      <Head>
        <title>Morphis Network - Login</title>
        <meta
          name="description"
          content="morphis network login"
        />
      </Head>
      <main className="h-full flex flex-col justify-center items-center bg-[#f0f3fb] overflow-y-auto">
        <div className="w-[full] max-w-[22.5rem] flex flex-col items-center">
          <Image
            alt="stars"
            className="md:w-[22.5rem] w-[80%] object-fit"
            height={315}
            priority
            src="/images/stars.svg"
            width={360}
          />
          <p className="font-bold text-center text-3xl leading-10 mb-5">Get Started</p>
          <p className="text-base text-center leading-5 mb-6">Your gateway to the top NFT communities and collectors like you!</p>
          <WalletDropdown
            classNames="!w-full max-w-full mb-5"
            containerClassNames="w-full"
          />
          <Tooltip
            classNames="!w-full"
            tip="Coming soon"
          >
            <Button
              className="!w-full mb-5 border-[#d8dadc]"
              disabled
              startIcon={<i className="fa-brands fa-twitter fa-xl ml-2" />}
              variant="outlined"
            >
              Connect Twitter
            </Button>
          </Tooltip>
          <Button
            className="border-[#d8dadc] mb-5"
            onClick={() => !session && signIn('discord', { callbackUrl: '/login' })}
            startIcon={
              <>
                {session && <div className="h-3.5 w-3.5 ml-2 rounded-full bg-[#82ffac]" />}
                <i className="fa-brands fa-discord fa-xl ml-2" />
              </>
            }
            variant={session?.user?.email ? 'contained' : 'outlined'}
          >
            <span className="block px-16 truncate">{session?.user?.name || 'Connect Discord'}</span>
          </Button>
          <CCSignInButton
            classNames="mb-5 truncate"
            contentClassNames="block px-16 truncate"
            startIcon={
              <>
                {address && accessToken && <div className="h-3.5 w-3.5 ml-2 rounded-full bg-[#82ffac]" />}
                <Image
                  alt=""
                  className={cl(['ml-2', address && accessToken && 'invert'])}
                  height={15}
                  src="/images/cyberconnect.svg"
                  width={21}
                />
              </>
            }
            variant={address && accessToken ? 'contained' : 'outlined'}
          />
          <div className="text-center font-bold">
            <Link
              className="opacity-100 transition-opacity hover:opacity-50"
              href="/profile"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default Login
