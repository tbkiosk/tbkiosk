import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'

import { Button } from '@/components'
import WalletDropdown from '@/layouts/components/wallet_dropdown'
import { ExtendedSession } from '@/types/nextauth'

const Login = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const isConnected = useMemo(() => session && !!(session as ExtendedSession)?.user?.name, [session])

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
          <div className="w-full mb-5">
            <WalletDropdown buttonClassName="!h-[3.375rem]" />
          </div>
          <Button
            className="!w-full mb-5 border-[#d8dadc]"
            onClick={() => signIn('twitter', { callbackUrl: '/login' })}
            startIcon={
              <>
                {isConnected && <div className="h-3.5 w-3.5 ml-2 rounded-full bg-[#82ffac]" />}
                <i className="fa-brands fa-twitter fa-xl ml-2" />
              </>
            }
            variant={isConnected ? 'contained' : 'outlined'}
          >
            {isConnected ? session?.user?.name : 'Connect Twitter'}
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outlined"
          >
            Launch App
          </Button>
        </div>
      </main>
    </>
  )
}

export default Login
