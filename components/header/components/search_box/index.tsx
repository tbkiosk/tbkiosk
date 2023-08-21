'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Combobox, TextInput, Title, Loader, Image, Text, useCombobox } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'

import classes from './styles.module.css'

import type { Project } from '@prisma/client'

export default function SearchBox() {
  const [value, setValue] = useState('')
  const [opened, setOpened] = useState(false)
  const [focused, setFocused] = useState(false)

  const [debouncedValue] = useDebouncedValue(value, 500)

  const { data, isLoading } = useQuery<Project[]>({
    enabled: !!debouncedValue,
    queryKey: ['projects-from-search-box', debouncedValue],
    queryFn: async () => {
      const res = await fetch(`/api/projects?search=${debouncedValue}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const projects = await res.json()
      return projects
    },
  })

  const combobox = useCombobox({ opened })

  const onWheel = (e: WheelEvent) => {
    e.stopImmediatePropagation()
  }

  useEffect(() => {
    if (isLoading || !debouncedValue) {
      setOpened(false)
      return
    }

    setOpened(focused)
  }, [focused, isLoading])

  useEffect(() => {
    if (opened) {
      window.addEventListener('wheel', onWheel, true)
    } else {
      window.removeEventListener('wheel', onWheel, true)
    }

    return () => window.removeEventListener('wheel', onWheel, true)
  }, [opened])

  return (
    <Box className={classes.container}>
      <Combobox store={combobox}>
        <Combobox.Target>
          <TextInput
            classNames={{
              root: classes['search-box-root'],
              input: classes['search-box-input'],
            }}
            onBlur={() => setFocused(false)}
            onChange={e => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search for collections, NFTs or users"
            rightSection={
              isLoading ? (
                <Loader
                  color="gray"
                  size="xs"
                />
              ) : (
                <i className="fa-solid fa-magnifying-glass" />
              )
            }
            value={value}
          />
        </Combobox.Target>
        <Combobox.Dropdown className={classes['search-box-dropdown']}>
          <Combobox.Options>
            {data?.length ? (
              data.map(_d => (
                <Link
                  href={`/projects/${_d.slug}`}
                  key={_d.id}
                >
                  <Combobox.Option value={_d.id}>
                    <Box className={classes['item-container']}>
                      <Image
                        alt="logo"
                        className={classes.logo}
                        src={_d.logoUrl}
                      />
                      <Box className={classes['info-col']}>
                        <Title
                          className={classes.name}
                          order={6}
                        >
                          {_d.name}
                        </Title>
                        <Text
                          c="gray.7"
                          className={classes.categories}
                          truncate
                        >
                          {_d.categories.join(',')}
                        </Text>
                      </Box>
                    </Box>
                  </Combobox.Option>
                </Link>
              ))
            ) : (
              <Title
                className={classes['no-projects']}
                order={5}
              >
                No projects
              </Title>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Box>
  )
}
