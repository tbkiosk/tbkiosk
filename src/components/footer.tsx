import { Box, Title, Group, ActionIcon, Text, TextInput, Button, Divider, Stack, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const Footer = () => {
  const largeScreen = useMediaQuery('(min-width: 48em)')

  return (
    <Box>
      <Divider my={rem(24)} />
      <Title
        order={4}
        mb={rem(12)}
        ta="center"
      >
        Stay in the loop
      </Title>
      <Text
        mb={rem(12)}
        ta="center"
      >
        Join our mailing list to stay in the loop with our newest feature releases, NFT drops and tips.
      </Text>
      <Group
        mb={rem(24)}
        noWrap
        position="center"
        w="100%"
      >
        <TextInput
          placeholder="Your email address"
          radius="md"
          w={480}
        />
        <Button
          color="dark"
          radius="md"
        >
          Sign up
        </Button>
      </Group>
      <Title
        order={4}
        mb={rem(12)}
        ta="center"
      >
        Join the community
      </Title>
      <Group
        noWrap
        position="center"
      >
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href="https://twitter.com"
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-x-twitter" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href="https://discord.com"
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-discord" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href="https://youtube.com"
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-youtube" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href="https://tiktok.com"
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-tiktok" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href=""
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-reddit-alien" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href=""
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-brands fa-instagram" />
          </a>
        </ActionIcon>
        <ActionIcon
          radius="md"
          size="lg"
          variant="light"
        >
          <a
            href=""
            rel="noreferrer"
            target="_blank"
          >
            <i className="fa-regular fa-envelope" />
          </a>
        </ActionIcon>
      </Group>
      <Divider my={rem(24)} />
      {largeScreen ? (
        <Group
          align="center"
          position="apart"
        >
          <Text fz="sm">©️ 2023 Kiosk</Text>
          <Group>
            <a>
              <Text fz="sm">Privacy Policy</Text>
            </a>
            <a>
              <Text fz="sm">Terms of Service</Text>
            </a>
          </Group>
        </Group>
      ) : (
        <Stack
          align="center"
          spacing={rem(4)}
        >
          <Text fz="sm">©️ 2023 Kiosk</Text>
          <Group>
            <a>
              <Text fz="sm">Privacy Policy</Text>
            </a>
            <a>
              <Text fz="sm">Terms of Service</Text>
            </a>
          </Group>
        </Stack>
      )}
    </Box>
  )
}

export default Footer
