import Link from 'next/link'
import { Box, Divider, Group, Text, Stack } from '@mantine/core'

import Logo from 'public/logo_with_text.svg'

import classes from './index.module.css'

export default function Footer() {
  return (
    <Box className={classes.container}>
      <Divider className={classes.divider} />
      <Group
        align="center"
        justify="space-between"
        visibleFrom="sm"
      >
        <Link
          className={classes.logo}
          href="/"
        >
          <Logo />
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
      <Stack
        align="center"
        gap={8}
        hiddenFrom="sm"
      >
        <Group
          justify="center"
          w="100%"
          wrap="nowrap"
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
          justify="space-between"
          w="100%"
          wrap="nowrap"
        >
          <Link
            className={classes.logo}
            href="/"
          >
            <Logo />
          </Link>
          <Text fz="sm">©️ 2023 Kiosk</Text>
        </Group>
      </Stack>
    </Box>
  )
}
