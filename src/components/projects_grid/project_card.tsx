import NextImage from 'next/image'
import { Image } from '@nextui-org/react'
import clsx from 'clsx'

import ProjectLinks from '../project_link'

import type { Project } from '@prisma/client'

const ProjectCard = ({ project, simple }: { project: Project; simple?: boolean }) => (
  <a
    className={clsx('flex flex-col p-1.5 border border-[#d9d9d9] rounded-lg cursor-pointer transition hover:shadow-md', !simple && 'pb-3')}
    href={`/projects/${project.slug}`}
    key={project.id}
    rel="noreferrer"
    target="_blank"
  >
    <Image
      alt={project.name}
      as={NextImage}
      className="object-cover aspect-[3/2]"
      height={500}
      isZoomed
      radius="md"
      src={project.bannerImage}
      width={500}
    />
    <div className="flex items-center gap-2 my-4 px-2">
      <Image
        alt=""
        as={NextImage}
        classNames={{
          wrapper: 'h-10 w-10 shrink-0',
          img: 'object-contain aspect-square',
        }}
        height={40}
        radius="lg"
        src={project.logoUrl}
        width={40}
      />
      <span className="grow overflow-hidden font-bold text-lg truncate">{project.name}</span>
    </div>
    {!simple && (
      <>
        <p className="h-[84px] max-h-[84px] mb-2 px-2 text-sm line-clamp-4">{project.description}</p>
        <div className="flex flex-wrap grow gap-2 mb-4 px-2 overflow-hidden">
          {project.categories.map(_c => (
            <span
              className="h-[22px] max-w-full px-2.5 py-0.5 bg-black rounded font-bold text-[11px] text-white truncate uppercase tracking-[0.25px]"
              key={_c}
            >
              {_c}
            </span>
          ))}
        </div>
        <ProjectLinks project={project} />
      </>
    )}
  </a>
)

export default ProjectCard
