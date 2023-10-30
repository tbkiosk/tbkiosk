'use client'

import { useRef } from 'react'
import NextImage from 'next/image'
import { Image, Button } from '@nextui-org/react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import Filters from './filters'
import ProjectsGrid from '@/components/projects_grid'
import LogoText from 'public/logo/logo-text.svg'
import Footer from '@/components/footer'

const HomeSlideTwo = () => {
  const projectsContainerRef = useRef<HTMLDivElement | null>(null)

  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => {
      projectsContainerRef.current?.scrollTop === 0 && eventData.deltaY > 50 && onPrevSlide()
    },
  })

  const onPrevSlide = () => slide.isActive && !swiper.destroyed && swiper?.slidePrev()

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (projectsContainerRef.current?.scrollTop !== 0) return

    e.deltaY < 0 && onPrevSlide()
  }

  const refPassthrough = (el: HTMLDivElement) => {
    handlers.ref(el)
    projectsContainerRef.current = el
  }

  return (
    <div
      className="h-full bg-white text-black overflow-y-auto custom-scrollbar"
      onWheel={onWheel}
      {...handlers}
      ref={refPassthrough}
    >
      <div className="h-full flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-8 md:px-16 py-16 md:py-24 bg-[#f5f5f5]">
          <Image
            alt="beep"
            as={NextImage}
            className="w-full max-w-[500px]"
            height={500}
            radius="none"
            src="/beep/beep-poster.png"
            width={500}
          />
          <div className="max-w-[528px] flex flex-col pt-8 md:pb-8">
            <p className="flex items-center font-medium">
              <span>Created by</span>
              <span className="h-4 ml-2 text-[#EA3323]">
                <LogoText />
              </span>
            </p>
            <p className="font-bold text-5xl md:text-[80px] leading-none">BEEP BOT</p>
            <p className="mb-4 text-[#808080]">Coming soon</p>
            <p className="font-medium text-sm md:text-lg">
              Beep is a Dollar-cost averaging (DCA) bot with a token-bound account.
              <br />
              <br />
              In a volatile market, Beep is your reliable companion, helping you navigate fluctuations by strategically spreading your
              purchases across different price levels.
            </p>
            <div className="flex flex-col-reverse items-start grow mt-8">
              <a
                className="w-full"
                href="https://tally.so/r/mKxWEX"
                rel="noreferrer"
                target="_blank"
              >
                <Button className="h-12 w-full bg-black hover:bg-[#0f0f0f] text-[#ffffff] rounded-full font-medium text-lg">
                  Join waitlist
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="w-full max-w-screen-2xl flex flex-col mx-auto px-8 md:px-16 pb-16">
          <p className="pt-16 pb-2 md:pb-10 font-bold text-lg text-center">LATEST PROJECTS</p>
          <Filters />
          <ProjectsGrid />
        </div>
        <div className="w-full max-w-screen-2xl mx-auto px-8">
          <hr className="border-black" />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default HomeSlideTwo
