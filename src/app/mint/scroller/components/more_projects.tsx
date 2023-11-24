'use client'

import { useState } from 'react'
import { match } from 'ts-pattern'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from '@nextui-org/react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'

import ProjectCard from '@/components/projects_grid/project_card'
import ChevronRight from 'public/icons/chevron-right.svg'

import type { Project } from '@prisma/client'

const PrevButton = () => {
  const swiper = useSwiper()

  return (
    <div className="h-full w-12 absolute left-0 top-0 flex items-center justify-start px-1 bg-gradient-to-l from-transparent from-20% via-white to-white z-10">
      <span
        className="h-4 w-4 cursor-pointer rotate-180 transition-transform hover:scale-110"
        onClick={() => swiper.slidePrev()}
      >
        <ChevronRight />
      </span>
    </div>
  )
}

const NextButton = () => {
  const swiper = useSwiper()

  return (
    <div className="h-full w-12 absolute right-0 top-0 flex items-center justify-end px-1 bg-gradient-to-r from-transparent from-20% via-white to-white z-10">
      <span
        className="h-4 w-4 cursor-pointer transition-transform hover:scale-110"
        onClick={() => swiper.slideNext()}
      >
        <ChevronRight />
      </span>
    </div>
  )
}

const MoreProjects = () => {
  const { data: projects, status } = useQuery<Project[]>({
    queryKey: ['more-projects'],
    queryFn: async () => {
      const res = await fetch(`/api/projects/parallel/recommendation`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      return await res.json()
    },
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const [isEnd, setIsEnd] = useState(false)
  const [isBeginning, setIsBeginning] = useState(false)

  return (
    <div>
      {match(status)
        .with('pending', () => (
          <div className="flex justify-center">
            <Spinner color="default" />
          </div>
        ))
        .with('success', () => (
          <Swiper
            allowTouchMove={false}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 6,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 12,
              },
              1440: {
                slidesPerView: 5,
                spaceBetween: 24,
              },
            }}
            draggable={false}
            onSlideChange={swiper => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            onInit={swiper => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            slidesPerView={1}
            spaceBetween={4}
            style={{
              position: 'relative',
            }}
          >
            {projects?.map(_project => (
              <SwiperSlide key={_project.id}>
                <ProjectCard
                  project={_project}
                  simple
                />
              </SwiperSlide>
            ))}
            {!isBeginning && <PrevButton />}
            {!isEnd && <NextButton />}
          </Swiper>
        ))
        .with('error', () => <p className="text-center">Failed to load projects</p>)
        .exhaustive()}
    </div>
  )
}

export default MoreProjects
