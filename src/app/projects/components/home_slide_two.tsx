'use client'

import { useRef } from 'react'
import { useSwiper, useSwiperSlide } from 'swiper/react'
import { useSwipeable } from 'react-swipeable'

import Filters from './filters'
import ProjectsGrid from '@/components/projects_grid'
import Footer from '@/components/footer'
import Carousel from './carousel/carousel'

const HomeSlideTwo = () => {
  const projectsContainerRef = useRef<HTMLDivElement | null>(null)

  const swiper_ = useSwiper()
  const slide = useSwiperSlide()

  const handlers = useSwipeable({
    onSwiped: eventData => {
      projectsContainerRef.current?.scrollTop === 0 && eventData.deltaY > 50 && onPrevSlide()
    },
  })

  const onPrevSlide = () => slide.isActive && !swiper_.destroyed && swiper_?.slidePrev()

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
        {/* FIRST HALF –– CAROUSEL */}

        <div>
          <Carousel />
        </div>

        {/* Rest of page */}
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

// 'use client'

// import { useRef } from 'react'
// import Link from 'next/link'
// import NextImage from 'next/image'
// import { Image, Button } from '@nextui-org/react'
// import { useSwiper, useSwiperSlide } from 'swiper/react'
// import { useSwipeable } from 'react-swipeable'
// import Slider from 'react-slick'

// import Filters from './filters'
// import ProjectsGrid from '@/components/projects_grid'
// import LogoText from 'public/logo/logo-text.svg'
// import Footer from '@/components/footer'

// const HomeSlideTwo = () => {
//   const projectsContainerRef = useRef<HTMLDivElement | null>(null)

//   const swiper = useSwiper()
//   const slide = useSwiperSlide()

//   const handlers = useSwipeable({
//     onSwiped: eventData => {
//       projectsContainerRef.current?.scrollTop === 0 && eventData.deltaY > 50 && onPrevSlide()
//     },
//   })

//   const onPrevSlide = () => slide.isActive && !swiper.destroyed && swiper?.slidePrev()

//   const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
//     if (projectsContainerRef.current?.scrollTop !== 0) return

//     e.deltaY < 0 && onPrevSlide()
//   }

//   const refPassthrough = (el: HTMLDivElement) => {
//     handlers.ref(el)
//     projectsContainerRef.current = el
//   }

//   const projectsData = [
//     <carousel_beep />,
//     <carousel_scroller />,
//     // ... more projects
//   ]

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//   }

//   return (
//     <div
//       className="h-full bg-white text-black overflow-y-auto custom-scrollbar"
//       onWheel={onWheel}
//       {...handlers}
//       ref={refPassthrough}
//     >
//       <div className="h-full flex flex-col">
//         {/* FIRST HALF –– CAROUSEL */}
//         <Slider {...settings}>
//           {projectsData.map((project, index) => (
//             <div key={index}>
//               <h2>{project.title}</h2>
//               <p>{project.description}</p>
//               <img
//                 src={project.imageUrl}
//                 alt={project.title}
//               />
//               {/* ... other project details */}
//             </div>
//           ))}
//         </Slider>

//         {/* SECOND HALF –– BELOW CAROUSEL */}
//         <div className="w-full max-w-screen-2xl flex flex-col mx-auto px-8 md:px-16 pb-16">
//           <p className="pt-16 pb-2 md:pb-10 font-bold text-lg text-center">LATEST PROJECTS</p>
//           <Filters />
//           <ProjectsGrid />
//         </div>
//         <div className="w-full max-w-screen-2xl mx-auto px-8">
//           <hr className="border-black" />
//         </div>
//         <Footer />
//       </div>
//     </div>
//   )
// }

// export default HomeSlideTwo
