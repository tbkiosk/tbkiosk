import Link from 'next/link'
import { Box, Divider, Group, Text } from '@mantine/core'

import Logo from 'public/logo_with_text.svg'

import classes from './index.module.css'

export default function Footer() {
  return (
    <Box className={classes.container}>
      <Divider className={classes.divider} />
      <Group
        align="center"
        justify="space-between"
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
    </Box>
  )
}
