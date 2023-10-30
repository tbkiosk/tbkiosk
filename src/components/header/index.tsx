import Link from 'next/link'

import { Button } from '@nextui-org/react'
import Searchbox from './searchbox'
import Logo from 'public/logo/logo-red.svg'
import LogoText from 'public/logo/logo-text.svg'
import X from 'public/icons/x.svg'

const Header = () => (
  <header className="h-[var(--header-height)] w-full fixed top-0 z-30 bg-[var(--header-background-color)]">
    <div className="h-full max-w-screen-2xl px-4 md:px-8 py-2 mx-auto flex items-center justify-between">
      <Link
        className="w-auto md:w-[180px] flex gap-4 items-center text-white"
        href="/"
      >
        <div className="w-11 h-11 text-white">
          <Logo />
        </div>
        <div className="h-5 hidden md:block">
          <LogoText />
        </div>
      </Link>
      <Searchbox />
      <div className="w-auto md:w-[180px] flex gap-4 items-center justify-end">
        <a
          href="https://creator.tbkiosk.xyz"
          rel="noreferrer"
          target="_blank"
        >
          <Button
            className="h-10 px-4 bg-[#2F2F2F] hover:bg-[#1F1F1F] text-[#E6E6E6] border border-[#373a40] rounded-xl font-medium"
            disableRipple
          >
            List a Project
          </Button>
        </a>
        <a
          href="https://twitter.com/tbkiosk"
          rel="noreferrer"
          target="_blank"
        >
          <Button
            className="h-10 w-10 bg-[#2F2F2F] hover:bg-[#1F1F1F] text-[#E6E6E6] border border-[#373a40] rounded-xl"
            disableRipple
            isIconOnly
          >
            <div className="w-4 h-4">
              <X />
            </div>
          </Button>
        </a>
      </div>
    </div>
  </header>
)

export default Header
