import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import cx from 'classix'

import { Loading } from '@/components'

type LayoutProps = {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
  ignoreSession?: boolean
}

const Layout = ({ children, className }: LayoutProps) => {
  const { data, status } = useSession()

  return (
    <div className={cx('h-full w-full flex flex-col', className)}>
      <header className="flex justify-between px-[160px] py-[40px]">
        <Link href="/discover">
          <Image
            alt="logo"
            height="40"
            priority
            src="/icons/logo_with_text.svg"
            width="160"
          />
        </Link>
        <div className="min-w-[40px] flex items-center gap-2">
          <Loading isLoading={status === 'loading'}>
            <>
              <Image
                alt="avatar"
                className="rounded-full"
                height="40"
                src={data?.user?.image || 'https://placehold.co/40x40/dddddd/dddddd/png'}
                width="40"
              />
            </>
          </Loading>
        </div>
      </header>
      <main className="px-[160px]">{children}</main>
    </div>
  )
}

export default Layout
