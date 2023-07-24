import { useContext } from 'react'
import Link from 'next/link'
import { Header as MantineHeader, Container, Flex, Avatar, ActionIcon, Indicator, Text, rem } from '@mantine/core'

import { UserContext } from '@/providers/user'

import Logo from '@/assets/icons/logo'

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
            <Flex gap="lg">
              <Link
                className="transition:opcaity hover:opacity-70"
                href="/discover"
              >
                <Text
                  className={
                    /\/discover/.test(location.href)
                      ? `before:content-[''] before:absolute before:inset-x-0 before:mx-auto before:bottom-0 before:rounded-full before:h-[3px] before:w-[50%] before:bg-gradient-to-r before:from-[#FD7E14] before:to-[#E64980]`
                      : ''
                  }
                  fw={700}
                  gradient={/\/discover/.test(location.href) ? { from: 'orange', to: 'pink', deg: 45 } : undefined}
                  pos="relative"
                  variant={/\/discover/.test(location.href) ? 'gradient' : 'text'}
                >
                  Discover
                </Text>
              </Link>
            </Flex>
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
