import Image from 'next/image'
import React from 'react'
import LogoText from 'public/logo/logo-text.svg'
import Link from 'next/link'
import { Button } from '@nextui-org/react'

const carousel_beep = () => {
  return (
    <>
      <div className="w-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-8 md:px-16 py-16 md:py-24 bg-[#f5f5f5]">
        <Image
          alt="beep"
          className="w-full max-w-[300px] lg:max-w-[500px] rounded-xl"
          height={500}
          src="/scroller/scroller_title.gif"
          width={500}
        />
        <div className="max-w-[528px] flex flex-col pt-8 md:pb-8">
          <p className="flex items-center font-medium">
            <span>Created by</span>
            <span className="h-4 ml-2 text-[#EA3323]">
              <LogoText />
            </span>
          </p>
          <p className="font-bold text-5xl md:text-[70px] leading-none">SCROLLER PASS</p>
          <p className="mb-4 text-[#808080]">Coming soon</p>
          <p className="font-medium text-sm md:text-lg">
            Scroller Pass is a tokenbound NFT which bridges your ETH when gas prices are optimal
            <br />
            <br />
            No fuss, just mint your Scroller Pass NFT, deposit some ETH and it will get to work bridging your balance to the Scroll L2
          </p>
          <div className="flex flex-col-reverse items-start grow mt-8">
            <Link
              className="w-full"
              href="/mint/scroller"
            >
              <Button className="h-12 w-full bg-black hover:bg-[#0f0f0f] text-[#ffffff] rounded-full font-medium text-lg">
                Test on Sepolia
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default carousel_beep
