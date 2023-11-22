import Link from 'next/link'

import Logo from 'public/logo/logo-red.svg'
import LogoText from 'public/logo/logo-text.svg'

const Footer = () => (
  <footer className="md:h-[var(--header-height)] w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 py-2 font-medium">
    <Link
      className="w-auto md:w-[180px] flex gap-4 items-center text-white"
      href="/"
    >
      <div className="w-11 h-11 text-black">
        <Logo />
      </div>
      <div className="h-5 text-black">
        <LogoText />
      </div>
    </Link>
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 my-2 md:my-0 transition-colors">
      <a
        className="hover:text-[#6a6a6a]"
        href="https://twitter.com/tbkiosk"
        rel="noreferrer"
        target="_blank"
      >
        TWITTER
      </a>
      <a
        className="hover:text-[#6a6a6a]"
        href="mailto:info@tbkiosk.xyz"
      >
        SUPPORT
      </a>
      <Link
        className="hover:text-[#6a6a6a]"
        href="/projects"
      >
        MANAGE PROJECT
      </Link>
    </div>
    <span>©️ 2023 Kiosk</span>
  </footer>
)

export default Footer
