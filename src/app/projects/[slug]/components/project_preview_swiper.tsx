'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import NextImage from 'next/image'
import { Image } from '@nextui-org/react'
import clsx from 'clsx'

import type { Project } from '@prisma/client'

const ProjectPreviewSwiper = ({ project }: { project: Project }) => (
  <Swiper
    breakpoints={{
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
    }}
    modules={[Pagination]}
    pagination={{
      bulletActiveClass: clsx('swiper-pagination-bullet-active', 'bullet-active-class'),
      bulletClass: clsx('swiper-pagination-bullet', 'bullet-class'),
    }}
    slidesPerView={1}
    spaceBetween={20}
  >
    {project.previewImages.map(_pi => (
      <SwiperSlide key={_pi}>
        <Image
          alt="preview img"
          as={NextImage}
          className="w-full h-[240px] md:h-[480px] object-cover"
          height={480}
          loading="eager"
          src={_pi}
          width={720}
        />
      </SwiperSlide>
    ))}
  </Swiper>
)

export default ProjectPreviewSwiper
