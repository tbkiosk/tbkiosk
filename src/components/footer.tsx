import Link from 'next/link'
import { Box, Group, Text, Divider, Stack, Image, rem } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const Footer = () => {
  const largeScreen = useMediaQuery('(min-width: 48em)')

  return (
    <Box>
      <Divider my={rem(24)} />
      {largeScreen ? (
        <Group
          align="center"
          position="apart"
        >
          <Link href="/">
            <Image
              alt="logo"
              maw={136}
              src="/logo_with_text_black.svg"
            />
          </Link>
          <Group>
            <a
              href="https://twitter.com/tbkiosk"
              rel="noreferrer"
              target="_blank"
            >
              <Text fz="sm">TWITTER</Text>
            </a>
            <a>
              <Text fz="sm">SUPPORT</Text>
            </a>
            <a
              href="https://creator.tbkiosk.xyz"
              rel="noreferrer"
              target="_blank"
            >
              <Text fz="sm">MANAGE PROJECT</Text>
            </a>
          </Group>
          <Text
            fz="sm"
            ta="right"
            w={150}
          >
            ©️ 2023 Kiosk
          </Text>
        </Group>
      ) : (
        <Stack
          align="center"
          spacing={rem(8)}
        >
          <Group
            position="center"
            w="100%"
          >
            <a
              href="https://twitter.com/tbkiosk"
              rel="noreferrer"
              target="_blank"
            >
              <Text fz="sm">TWITTER</Text>
            </a>
            <a>
              <Text fz="sm">SUPPORT</Text>
            </a>
            <a
              href="https://creator.tbkiosk.xyz"
              rel="noreferrer"
              target="_blank"
            >
              <Text fz="sm">MANAGE PROJECT</Text>
            </a>
          </Group>
          <Group
            align="center"
            position="apart"
            w="100%"
          >
            <Link href="/">
              <Image
                alt="logo"
                maw={136}
                src="/logo_with_text_black.svg"
                sx={theme => ({
                  filter: theme.colorScheme === 'dark' ? 'invert(1)' : 'none',
                })}
              />
            </Link>
            <Text fz="sm">©️ 2023 Kiosk</Text>
          </Group>
        </Stack>
      )}
    </Box>
  )
}

export default Footer
