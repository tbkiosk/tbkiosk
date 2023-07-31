import { useContext, forwardRef, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Header as MantineHeader, Container, Flex, Group, Box, Center, Avatar, Menu, Select, Text, rem } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
import { UserContext } from '@/providers/user'

import Logo from '@/assets/icons/logo_with_text.svg'

import { request } from '@/utils/request'

import { useDebouncedEffect } from '@/hooks/dom/useDebouncedEffect'

import type { Project } from '@prisma/client'
import type { SelectItemProps } from '@mantine/core'

type ItemProps = Project & SelectItemProps

const AutoCompleteItem = forwardRef<HTMLAnchorElement, ItemProps>(({ logoUrl, name, id }: ItemProps, ref) => (
  <Link
    href={`/discover/${id}`}
    ref={ref}
  >
    <Group
      mx={4}
      my={4}
      noWrap
    >
      <Avatar src={logoUrl} />
      <Text>{name}</Text>
    </Group>
  </Link>
))

AutoCompleteItem.displayName = 'AutoCompleteItem'

const Header = () => {
  const { image, name } = useContext(UserContext)

  const [search, setSearch] = useState('')

  const { data, mutate } = useMutation({
    mutationFn: async ({ search }: { search: string }) => {
      const { error, data } = await request<Project[]>({
        url: '/api/discover',
        params: {
          search,
        },
      })

      if (error) {
        throw new Error(error as string)
      }

      return data || []
    },
    onError: error => {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: (error as Error)?.message,
      })
    },
  })

  useDebouncedEffect(() => {
    if (search) {
      mutate({ search })
    }
  }, [search])

  return (
    <MantineHeader
      height="72"
      p="md"
    >
      <Container
        maw={rem(1440)}
        px={rem(64)}
      >
        <Flex
          align="center"
          justify="space-between"
        >
          <Link href="/">
            <Center>
              <Logo />
            </Center>
          </Link>
          <Box
            maw={400}
            miw={120}
            mx={rem(24)}
            style={{ flex: 1 }}
          >
            <Select
              data={!search ? [] : data?.map(_project => ({ ..._project, value: _project.id, label: _project.name })) || []}
              filter={() => true}
              itemComponent={AutoCompleteItem}
              onSearchChange={value => setSearch(value)}
              placeholder="Search for collections, NFTs or users"
              radius={rem(12)}
              rightSection={<i className="fa-solid fa-magnifying-glass text-[#aaa]" />}
              searchable
              searchValue={search}
            />
          </Box>
          <Group
            noWrap
            spacing={rem(24)}
          >
            <Menu
              shadow="md"
              width={200}
            >
              <Menu.Target>
                <Avatar
                  alt=""
                  className="cursor-pointer"
                  radius="xl"
                  src={image}
                >
                  {!image && (name || '')?.slice(0, 2)}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Link href="/settings">
                  <Menu.Item icon={<i className="fa-solid fa-gear" />}>Settings</Menu.Item>
                </Link>
                <Menu.Item
                  icon={<i className="fa-solid fa-arrow-right-from-bracket" />}
                  onClick={() => signOut()}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Flex>
      </Container>
    </MantineHeader>
  )
}

export default Header
