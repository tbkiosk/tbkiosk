'use client'

import { useEffect } from 'react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import ScrollDown from '/public/icons/scrolldown.svg'

const HomeSlideOne = () => {
  const swiper = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => eventData.deltaY < -10 && onNextSlide(),
  })

  const onWheel = (e: WheelEvent) => e.deltaY > 0 && onNextSlide()

  const onNextSlide = () => slide.isActive && !swiper.destroyed && swiper?.slideNext()

  useEffect(() => {
    if (slide.isActive) {
      window.addEventListener('wheel', onWheel)
    } else {
      window.removeEventListener('wheel', onWheel)
    }
  }, [slide.isActive])

  useEffect(() => () => window.removeEventListener('wheel', onWheel), [])

  return (
    <div
      className="h-full relative"
      {...handlers}
    >
      <div className="absolute bottom-3 left-0 right-0 text-center animate-bounce ease-in-out repeat-infinite">
        <div
          className="h-8 w-8 mx-auto p-2 cursor-pointer"
          onClick={() => swiper.slideNext()}
        >
          <ScrollDown />
        </div>
      </div>
    </div>
  )
}

export default HomeSlideOne
