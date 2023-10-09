import NextImage from 'next/image'
import { Image } from '@nextui-org/image'
import dayjs from 'dayjs'

import Header from '@/components/header'
import ProjectLinks from '@/components/project_link'
import ProjectPreviewSwiper from './components/project_preview_swiper'
import ProjectRecommendation from './components/project_recommendation'
import Footer from '@/components/footer'

import { prismaClient } from '@/lib/prisma'

import type { Metadata } from 'next'
import type { Project } from '@prisma/client'

export const generateMetadata = async ({ params }: { params: { slug: string } }): Promise<Metadata> => ({
  title: `Kiosk - Project ${params.slug}`,
})

const getProject = async (slug: string): Promise<Project | null> =>
  await prismaClient.project.findFirst({
    where: {
      slug,
    },
  })

const ProjectSlug = async ({ params }: { params: { slug: string } }) => {
  const project = await getProject(params.slug)

  return (
    <>
      <Header />
      <main className="h-[100vh] pt-[var(--header-height)] bg-white text-black overflow-hidden">
        {project && (
          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="h-[480px] max-h-[480px] relative">
              <Image
                alt={project.name}
                as={NextImage}
                className="h-[480px] max-h-[480px] object-cover"
                height={480}
                loading="eager"
                radius="none"
                src={project.bannerImage}
                width={1920}
              />
              <div className="max-w-screen-2xl absolute -bottom-[84px] left-0 right-0 flex justify-center md:justify-start mx-auto px-8">
                <Image
                  alt={project.name}
                  as={NextImage}
                  className="h-full w-full rounded-[56px] border-[9px] border-white object-cover"
                  height={168}
                  loading="eager"
                  src={project.logoUrl}
                  width={168}
                />
              </div>
            </div>
            <div className="max-w-screen-2xl flex flex-col gap-4 mt-[108px] mx-auto px-8 pb-4">
              <div className="flex items-center justify-between flex-wrap md:flex-nowrap gap-4 md:gap-16">
                <div className="flex items-center gap-2 font-bold overflow-hidden">
                  <span className="text-[22px] truncate">{project.name}</span>
                  <span className="px-2 py-0.5 bg-[#c8fd7c] rounded text-xs tracking-[0.25px] uppercase">{project.projectStage}</span>
                </div>
                <ProjectLinks
                  className="w-full md:w-auto !justify-start"
                  project={project}
                  showExtraLinks
                />
              </div>
              <div className="leading-6">
                <span className="mr-2">Added:</span>
                <span className="font-bold">{dayjs(project.createdAt).format('MMM DD YYYY')}</span>
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex items-center shrink-0">
                  <span className="mr-2">Built on:</span>
                  <span className="max-w-full px-2.5 py-0.5 bg-black rounded font-bold text-[11px] text-white truncate uppercase tracking-[0.25px]">
                    {project.blockchains}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span>Categories:</span>
                  {project.categories.map(_c => (
                    <span
                      className="max-w-full px-2.5 py-0.5 bg-black rounded font-bold text-[11px] text-white truncate uppercase tracking-[0.25px]"
                      key={_c}
                    >
                      {_c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-screen-2xl mx-auto p-8">
              <p className="font-bold border-b border-b-black">Project Details</p>
              <p className="py-4">{project.description}</p>
              <div className="pt-4 pb-8 md:pt-8 border-b border-b-black">
                <ProjectPreviewSwiper project={project} />
              </div>
            </div>
            <div className="max-w-screen-2xl mx-auto p-8 pt-0">
              <p className="mb-8 font-bold text-[22px]">You may also like this</p>
              <ProjectRecommendation slug={params.slug} />
            </div>
            <div className="max-w-screen-2xl mx-auto px-8">
              <hr className="border-black" />
            </div>
            <Footer />
          </div>
        )}
        {!project && <div className="h-full flex items-center justify-center">Project not found</div>}
      </main>
    </>
  )
}

export default ProjectSlug
