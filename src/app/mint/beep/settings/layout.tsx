import BeepSettingsConnectButton from './components/beep_settings_connect_button'

import type { Metadata } from 'next'

const BeepSettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh] bg-[#1d1d1f] bg-cover bg-no-repeat overflow-y-auto">
      <header className="">
        <div className="h-full max-w-screen-2xl px-4 md:px-8 py-4 md:py-8 mx-auto flex items-center justify-between">
          <div className="h-[36px]">
            <svg
              width="112"
              height="36"
              viewBox="0 0 112 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.952 1.036H21.544V7.948H7.864V15.004H28.552V21.82H7.768V28.732H28.552V35.596H0.952V1.036ZM14.776 7.948H21.544V15.004H14.776V7.948ZM21.544 21.82H28.552V28.732H21.544V21.82ZM35.5469 0.939999H56.2829V7.9H42.4109V14.812H49.4189V21.772H42.4109V28.732H56.2829V35.548H35.5469V0.939999ZM63.2031 0.939999H83.9391V7.9H70.0671V14.812H77.0751V21.772H70.0671V28.732H83.9391V35.548H63.2031V0.939999ZM104.779 21.532H97.8674V35.404H90.9554V0.795998H111.787V7.708H97.9634V14.62H104.779V21.532ZM104.875 7.708H111.787L111.739 21.532H104.827L104.875 7.708Z"
                fill="white"
              />
            </svg>
          </div>
          <BeepSettingsConnectButton />
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
