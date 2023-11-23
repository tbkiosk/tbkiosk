'use client'

import { ConnectWallet } from '@thirdweb-dev/react'
import { twMerge } from 'tailwind-merge'

const ConnectWalletButton = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <ConnectWallet
    className={twMerge(
      '!h-10 !min-w-[148px] !gap-2 !px-3 !bg-black !text-sm !text-white !rounded-lg [&>img]:!h-5 [&>img]:!w-5 [&>div]:!gap-0',
      className
    )}
    switchToActiveChain
    style={style}
    theme="dark"
  />
)

export default ConnectWalletButton
