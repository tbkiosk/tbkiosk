'use client'

import { useEffect, useState } from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from '@nextui-org/react'
import { useIsMounted } from 'usehooks-ts'
import clsx from 'clsx'

import GlobeIcon from 'public/icons/globe.svg'
import DiscordIcon from 'public/icons/discord.svg'
import XIcon from 'public/icons/x.svg'
import ShareIcon from 'public/icons/share.svg'
import EllipsisIcon from 'public/icons/ellipsis.svg'
import CopyIcon from 'public/icons/copy.svg'
import WarningIcon from 'public/icons/triangle-exclamation.svg'

import type { Project } from '@prisma/client'

const ProjectLinks = ({ className, project, showExtraLinks }: { className?: string; project: Project; showExtraLinks?: boolean }) => {
  const isMounted = useIsMounted()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isMounted()) {
      setMounted(true)
    }
  }, [isMounted])

  if (!mounted) return null

  return (
    <div className={clsx('flex items-center justify-end shrink-0 gap-6 px-2 text-[#ed3733]', className)}>
      {project.website && (
        <span
          className="h-5 w-5 cursor-pointer transform-opacity transition-transform hover:opacity-80 hover:scale-[1.1]"
          onClick={e => {
            e.stopPropagation()
            window.open(project.website as string)
          }}
        >
          <GlobeIcon />
        </span>
      )}
      {project.discord && (
        <span
          className="h-5 cursor-pointer transform-opacity transition-transform hover:opacity-80 hover:scale-[1.1]"
          onClick={e => {
            e.stopPropagation()
            window.open(project.discord as string)
          }}
        >
          <DiscordIcon />
        </span>
      )}
      {project.twitter && (
        <span
          className="h-5 w-5 cursor-pointer transform-opacity transition-transform hover:opacity-80 hover:scale-[1.1]"
          onClick={e => {
            e.stopPropagation()
            window.open(project.twitter as string)
          }}
        >
          <XIcon />
        </span>
      )}
      {showExtraLinks && (
        <>
          <a
            className="h-5 w-5 cursor-pointer transform-opacity transition-transform hover:opacity-80 hover:scale-[1.1]"
            onClick={e => {
              e.stopPropagation()
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(
                  `${project.name} | ${project.blockchains.join(' ')}`
                )}`
              )
            }}
          >
            <ShareIcon />
          </a>
          <Dropdown className="bg-white">
            <DropdownTrigger>
              <span className="h-5 w-5 cursor-pointer transform-opacity transition-transform hover:opacity-80 hover:scale-[1.1]">
                <EllipsisIcon />
              </span>
            </DropdownTrigger>
            <DropdownMenu aria-label="project actions">
              <DropdownSection>
                <DropdownItem
                  key="copy"
                  startContent={
                    <span className="w-4 h-4">
                      <CopyIcon />
                    </span>
                  }
                >
                  Copy link
                </DropdownItem>
              </DropdownSection>
              <DropdownItem
                className="!text-[#ed3733]"
                key="report"
                onClick={() =>
                  window.open(
                    `https://docs.google.com/forms/d/e/1FAIpQLSedEm56AAsrkssUTGF2pALbbHzoxiFgwJNrWW0h5uws4hYAxA/viewform?entry.1073118097=${project.id}`
                  )
                }
                startContent={
                  <span className="w-4 h-4 text-[#ed3733]">
                    <WarningIcon />
                  </span>
                }
              >
                Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </div>
  )
}

export default ProjectLinks
