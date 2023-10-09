import Link from 'next/link'

import Logo from 'public/logo/logo-red.svg'
import LogoText from 'public/logo/logo-text.svg'

const Footer = () => (
  <footer className="h-[var(--footer-height)] shrink-0 bg-[var(--footer-background-color)]">
    <div className="h-full max-w-screen-2xl flex items-center justify-between mx-auto px-8 py-2">
      <Link
        className="w-auto md:w-[180px] flex gap-4 items-center text-white"
        href="/"
      >
        <div className="w-11 h-11 text-black">
          <Logo />
        </div>
        <div className="h-5 hidden md:block text-black">
          <LogoText />
        </div>
      </Link>
      <span>©️ 2023 Kiosk</span>
    </div>
  </footer>
)

export default Footer
