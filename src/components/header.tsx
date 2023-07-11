import { Header as MantineHeader, Container, Flex, Avatar, Box, rem } from '@mantine/core'

import Logo from '@/assets/icons/logo'

const Header = () => (
  <MantineHeader
    height="auto"
    p="xs"
  >
    <Container maw={rem(1440)}>
      <Flex justify="space-between">
        <Flex
          align="center"
          className="cursor-pointer"
        >
          <Logo />
        </Flex>
        <Flex align="center">
          <Avatar
            alt=""
            src="avatar.png"
            radius="xl"
          />
        </Flex>
      </Flex>
    </Container>
  </MantineHeader>
)

export default Header
