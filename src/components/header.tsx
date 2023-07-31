import { useContext } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Header as MantineHeader, Container, Flex, Group, Box, Center, Avatar, TextInput, Menu, rem } from '@mantine/core'

import { UserContext } from '@/providers/user'

import Logo from '@/assets/icons/logo_with_text.svg'

const Header = () => {
  const { image, name } = useContext(UserContext)

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
            <TextInput
              placeholder="Search for collections, NFTs or users"
              radius={rem(12)}
              rightSection={<i className="fa-solid fa-magnifying-glass text-[#aaa]" />}
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
