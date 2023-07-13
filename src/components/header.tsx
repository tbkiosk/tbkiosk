import { useContext } from 'react'
import Link from 'next/link'
import { Header as MantineHeader, Container, Flex, Avatar, ActionIcon, Indicator, Box, Text, rem } from '@mantine/core'

import { UserContext } from '@/providers/user'

import Logo from '@/assets/icons/logo'

const Header = () => {
  const { image, name } = useContext(UserContext)

  return (
    <MantineHeader
      height="72"
      p="md"
    >
      <Container maw={rem(1440)}>
        <Flex justify="space-between">
          <Flex
            align="center"
            className="cursor-pointer"
          >
            <Logo />
          </Flex>
          <Flex
            align="center"
            gap={rem(24)}
          >
            <Box>
              <Link
                className="transition:opcaity hover:opacity-70"
                href="/discover"
              >
                <Text fw={700}>Discover</Text>
              </Link>
            </Box>
            <Indicator
              color="red"
              offset={4}
            >
              <ActionIcon
                radius="xl"
                size="lg"
                variant="light"
              >
                <i className="fa-regular fa-bell text-lg"></i>
              </ActionIcon>
            </Indicator>
            <Avatar
              alt=""
              className="cursor-pointer"
              radius="xl"
              src={image}
            >
              {!image && (name || '')?.slice(0, 2)}
            </Avatar>
          </Flex>
        </Flex>
      </Container>
    </MantineHeader>
  )
}

export default Header
