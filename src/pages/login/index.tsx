import Head from 'next/head'
import Image from 'next/image'
// import Link from 'next/link'
import { signIn } from 'next-auth/react'
import cl from 'classnames'

import { Button, Tooltip } from '@/components'
import WalletDropdown from '@/layouts/components/wallet_dropdown'

const Login = () => {
  return (
    <>
      <Head>
        <title>Morphis Network - Login</title>
        <meta name="description" content="morphis network login" />
      </Head>
      <main className="h-full flex flex-col justify-center items-center bg-[#f0f3fb] overflow-y-auto">
        <div className="w-[full] max-w-[360px]">
          <Image
            alt="stars"
            height={315}
            priority
            src="/images/stars.svg"
            width={360}
          />
          <p className="font-bold text-center text-3xl leading-10 mb-5">
            Get Started
          </p>
          <p className="text-base text-center leading-5 mb-6">
            Your gateway to the top NFT communities and collectors like you!
          </p>
          <WalletDropdown
            classNames="w-full max-w-full mb-5"
            containerClassNames="w-full"
          />
          <Tooltip tip="Coming soon">
            <Button
              className="border-[#d8dadc] mb-5"
              disabled
              startIcon={<i className="fa-brands fa-twitter fa-xl ml-2" />}
              variant="outlined"
            >
              Connect Twitter
            </Button>
          </Tooltip>
          <div className="group relative">
            <span
              className={cl([
                'px-4 py-2 text-sm text-gray-100 rounded-md absolute left-1/2 bg-gray-800 invisible z-[1050] opacity-0 transition-opacity',
                'group-hover:visible group-hover:opacity-90 -translate-x-1/2 -translate-y-[120%]',
              ])}
            >
              Coming soon
            </span>
          </div>
          <Button
            className="border-[#d8dadc] mb-5"
            onClick={() => signIn('discord', { callbackUrl: '/profile' })}
            startIcon={<i className="fa-brands fa-discord fa-xl ml-2" />}
            variant="outlined"
          >
            Connect Discord
          </Button>
          {/* <div
            className={cl([
              'text-center font-bold',
              connected ? 'visible' : 'invisible',
            ])}
          >
            <Link
              className="opacity-100 transition-opacity hover:opacity-50"
              href="/profile"
            >
              Skip for now
            </Link>
          </div> */}
        </div>
      </main>
    </>
  )
}

export default Login
