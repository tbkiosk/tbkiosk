import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import './carousel_styles.css'

import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import Beep from './carousel_beep'
import Scroller from './carousel_scroller'

const Carousel = () => {
  return (
    <>
      <Swiper
        speed={2000}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Beep />
        </SwiperSlide>
        <SwiperSlide>
          <Scroller />
        </SwiperSlide>
      </Swiper>
    </>
  )
}

export default Carousel
