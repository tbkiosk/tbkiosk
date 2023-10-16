import ConnectWalletButton from '@/components/connect_wallet_button'

import BeepTextLogo from 'public/beep/beep-text-logo.svg'

import type { Metadata } from 'next'

const BeepSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] bg-black bg-[url('/beep/tba-bg.svg')] bg-cover bg-no-repeat overflow-y-auto">
      <header className="h-[var(--header-height)]">
        <div className="h-full max-w-screen-2xl px-4 md:px-8 py-2 mx-auto flex items-center justify-between">
          <span className="h-[50px]">
            <BeepTextLogo />
          </span>
          <ConnectWalletButton
            className="!bg-transparent !text-[#78edc1] [&>div>span:first-child]:text-[#78edc1]"
            style={{ border: '1px solid #78edc1' }}
          />
        </div>
      </header>
      {children}
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Kiosk - Beep Settings',
}

export default BeepSettingsLayout
