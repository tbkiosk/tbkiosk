import { useMemo } from 'react'
import Image from 'next/image'
import { useWallet } from '@suiet/wallet-kit'
import { useAccount } from 'wagmi'
import cl from 'classnames'

type LayoutProps = {
  children?: React.ReactNode | React.ReactNode[]
  className?: string
}

const Layout = ({ children, className }: LayoutProps) => {
  const { isConnected: ethIsConnected } = useAccount({ onConnect: () => null })
  const { connected: suiConnected } = useWallet()

  const connectedWallets = useMemo(() => +ethIsConnected + +suiConnected, [ethIsConnected, suiConnected])

  return (
    <div className={cl(['h-full w-full flex flex-col', className])}>
      <header className="flex justify-between px-[160px] py-[40px]">
        <Image
          alt="artwork_4"
          height={40}
          src="/icons/logo_with_text.svg"
          width={160}
        />
        <div className="flex items-center gap-2">
          <div className="h-[40px] w-[40px] rounded-full bg-gray-200" />
          <span className="cursor-pointer">
            {connectedWallets} wallet{connectedWallets === 1 ? '' : 's'} connected
          </span>
        </div>
      </header>
      <main className="px-[160px]">{children}</main>
    </div>
  )
}

export default Layout
