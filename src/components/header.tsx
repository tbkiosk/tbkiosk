import { forwardRef, useState } from 'react'
import Link from 'next/link'
import { Header as MantineHeader, Container, Flex, Group, Box, Center, Avatar, Button, Select, Text, rem, ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useMutation } from '@tanstack/react-query'
// import { UserContext } from '@/providers/user'

import Logo from 'public/logo_with_text.svg'

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
  // const { image, name } = useContext(UserContext)

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
            <Center
              maw={162}
              sx={theme => ({ color: theme.colorScheme === 'dark' ? '#fff' : '#000' })}
              w={162}
            >
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
              radius="md"
              rightSection={
                <Text
                  component="span"
                  sx={theme => ({ color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[4] })}
                >
                  <i className="fa-solid fa-magnifying-glass" />
                </Text>
              }
              searchable
              searchValue={search}
            />
          </Box>
          <Group
            position="right"
            maw={162}
            noWrap
            spacing="md"
            w={162}
          >
            <a
              href="https://creator.tbkiosk.xyz"
              rel="noreferrer"
              target="_blank"
            >
              <Button
                color="dark"
                radius="md"
                variant="filled"
              >
                List a Project
              </Button>
            </a>
            <a
              href="https://twitter.com"
              rel="noreferrer"
              target="_blank"
            >
              <ActionIcon
                radius="md"
                size="lg"
                sx={{
                  backgroundColor: '#fd222a',
                  '&:hover': {
                    backgroundColor: '#fd222a',
                    opacity: 0.8,
                  },
                }}
                variant="filled"
              >
                <i className="fa-brands fa-x-twitter" />
              </ActionIcon>
            </a>
          </Group>
        </Flex>
      </Container>
    </MantineHeader>
  )
}

export default Header
