'use client'

import dynamic from 'next/dynamic'
import { Swiper, SwiperSlide } from 'swiper/react'

const SlideOne = dynamic(() => import('./home_slide_one'))
const SlideTwo = dynamic(() => import('./home_slide_two'))

const HomeSlideshow = () => {
  return (
    <Swiper
      allowTouchMove={false}
      className="h-full w-full overflow-hidden"
      direction="vertical"
      hashNavigation={{
        watchState: true,
      }}
      oneWayMovement
      slidesPerView={1}
      spaceBetween={0}
      speed={800}
    >
      <SwiperSlide>
        <SlideOne />
      </SwiperSlide>
      <SwiperSlide>
        <SlideTwo />
      </SwiperSlide>
    </Swiper>
  )
}

export default HomeSlideshow
