import dynamic from 'next/dynamic'

import Typewriter from './components/typewriter'

import type { Metadata } from 'next'

const Slideshow = dynamic(() => import('./components/home_slideshow'), { ssr: false })

const Projects = () => (
  <main className="h-[100vh] pt-[var(--header-height)] bg-black text-white overflow-y-auto">
    <div className="h-full flex flex-col items-center justify-center">
      <video
        autoPlay
        className="h-[180px] md:h-[206px] w-[180px] md:w-[206px] mb-8 md:mb-[72px] object-cover"
        loop
        muted
      >
        <source
          src="/kiosk.mp4"
          type="video/mp4"
        />
      </video>
      <Typewriter />
    </div>
    <div className="w-full absolute inset-0 top-[var(--header-height)] z-20">
      <Slideshow />
    </div>
  </main>
)

export const metadata: Metadata = {
  title: 'Kiosk - ERC 6551 Projects',
  description: 'Digital ownership and utilities, powered by ERC 6551',
  keywords: ['NFT', 'ERC 6551', 'ETH', 'Web3'],
}

export default Projects
