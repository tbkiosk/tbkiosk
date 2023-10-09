'use client'

import { ConnectWallet } from '@thirdweb-dev/react'
import clsx from 'clsx'

const ConnectWalletButton = ({ className }: { className?: string }) => (
  <ConnectWallet
    className={clsx(
      '!h-10 !min-w-[140px] !gap-2 !px-3 !text-sm !bg-black !text-white !rounded-lg [&>img]:!h-5 [&>img]:!w-5 [&>div]:!gap-0.5',
      className
    )}
    theme="dark"
  />
)

export default ConnectWalletButton
