import { useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import cx from 'classix'

import WalletConnectModal from '@/components/__login__/wallet_connect_modal'

const Login = () => {
  // const { data: session } = useSession()
  // const router = useRouter()

  // useEffect(() => {
  //   if (session) {
  //     router.push('/discover')
  //   }
  // }, [session, router])

  return (
    <>
      <Head>
        <title>Morphis Airdawg - Login</title>
        <meta
          name="description"
          content="Morphis Airdawg login"
        />
      </Head>
      <div className={cx('h-full w-full flex flex-col')}>
        <WalletConnectModal
          open={true}
          setOpen={() => null}
        />
        <header className="flex justify-between px-[160px] py-10 blur-sm">
          <Image
            alt="logo"
            height="40"
            priority
            src="/icons/logo_with_text.svg"
            width="160"
          />
          <div className="min-w-[40px] flex items-center gap-2">
            <>
              <Image
                alt="avatar"
                className="rounded-full"
                height="40"
                src="https://placehold.co/40x40/dddddd/dddddd/png"
                width="40"
              />
            </>
          </div>
        </header>
        <main className="flex flex-col px-[160px] py-8 blur-sm">
          <div className="h-[360px] w-full mb-8 bg-blue-200 rounded-2xl"></div>
          <p className="flex items-center gap-2 mb-4 font-bold text-2xl">
            Lorem ipsum dolor
            <span className="w-6 h-6 bg-yellow-400 rounded-full"></span>
          </p>
          <p className="flex gap-4">
            <span>Lorem</span>
            <span>ipsum</span>
            <span>doloripsum</span>
            <span>test</span>
            <span>abc</span>
          </p>
        </main>
      </div>
    </>
  )
}

export default Login
