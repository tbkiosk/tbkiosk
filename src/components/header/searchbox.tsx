'use client'

import { useEffect, useRef, useState } from 'react'
import NextImage from 'next/image'
import { Input, Image, Spinner } from '@nextui-org/react'
import { useDebounce, useOnClickOutside } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'

import MagnifyingGlass from 'public/icons/magnifying-glass.svg'

import type { Project } from '@prisma/client'

const Searchbox = () => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)

  const debouncedSearch = useDebounce<string>(search, 500)

  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setFocused(false))

  const { data, error, isFetching } = useQuery<Project[]>({
    enabled: !!debouncedSearch,
    queryKey: ['projects-from-search-box', debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/projects?search=${debouncedSearch}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const data: { data: Project[] } = await res.json()
      return data?.data || []
    },
    refetchOnWindowFocus: false,
  })

  const onWheel = (e: WheelEvent) => {
    e.stopImmediatePropagation()
  }

  useEffect(() => {
    if (isFetching || !debouncedSearch) {
      setOpen(false)
      return
    }

    setOpen(focused)
  }, [focused, isFetching])

  /**
   * In order not to trigger swiper's paging,
   * we have to add wheel listener and e.stopImmediatePropagation()
   */
  useEffect(() => {
    if (open) {
      window.addEventListener('wheel', onWheel, true)
    } else {
      window.removeEventListener('wheel', onWheel, true)
    }

    return () => window.removeEventListener('wheel', onWheel, true)
  }, [open])

  const renderPopup = () => {
    if (data && data?.length > 0) {
      return data?.map(_data => (
        <a
          className="flex items-center px-2 py-1 gap-2 transition-colors hover:bg-[#0e0e0f]"
          href={`/projects/${_data.slug}`}
          key={_data.id}
          rel="noreferrer"
          target="_blank"
        >
          <Image
            alt={_data.name}
            as={NextImage}
            classNames={{
              wrapper: 'shrink-0',
            }}
            height={32}
            radius="sm"
            src={_data.logoUrl}
            width={32}
          />
          <div className="overflow-hidden">
            <p className="text-[#c1c2c5] truncate">{_data.name}</p>
            <p className="text-xs text-[#495057]">{_data.categories.join(',')}</p>
          </div>
        </a>
      ))
    }

    if (!data?.length) {
      return <p className="py-4 font-lg text-center">No projects found</p>
    }

    if (error) {
      return <p className="py-4 font-lg text-center">{(error as Error)?.message || 'Failed to search projects'}</p>
    }
  }

  return (
    <div className="max-w-[480px] px-8 grow hidden md:block">
      <div
        className="relative"
        ref={ref}
      >
        <Input
          classNames={{
            base: 'bg-[#25262b] text-[#c1c2c5] rounded-xl',
            inputWrapper: 'h-8 !bg-transparent',
            input: '!text-white',
          }}
          endContent={
            isFetching ? (
              <Spinner
                classNames={{ circle1: 'border-b-[#5c5f66]', circle2: 'border-b-[#5c5f66]' }}
                size="sm"
              />
            ) : (
              <div className="h-4 w-4 text-[#5c5f66]">
                <MagnifyingGlass />
              </div>
            )
          }
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search for collections, NFTs or users"
          value={search}
        />
        {open && (
          <div className="w-full max-h-[180px] absolute top-[48px] z-30 overflow-y-auto bg-[#25262b] text-[#5c5f66] border border-[#373a40] rounded custom-scrollbar">
            {renderPopup()}
          </div>
        )}
      </div>
    </div>
  )
}

export default Searchbox
