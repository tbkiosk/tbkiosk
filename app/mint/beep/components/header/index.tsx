'use client'

import Link from 'next/link'
import { AppShell, Container, Box, Group } from '@mantine/core'
import { ConnectWallet } from '@thirdweb-dev/react'

import LogoWithTextBlack from 'public/logo_with_text_black.svg'
import Logo from 'public/logo.svg'

import classes from './styles.module.css'

export default function Header() {
  return (
    <AppShell.Header
      className={classes.header}
      withBorder={false}
      zIndex={1500}
    >
      <Container className={classes.container}>
        <Link
          className={classes['logo-container']}
          href="/"
        >
          <Box
            className={classes['logo-wrapper']}
            visibleFrom="sm"
          >
            <LogoWithTextBlack />
          </Box>
          <Box
            className={classes['logo-wrapper']}
            hiddenFrom="sm"
          >
            <Logo />
          </Box>
        </Link>
        <Group className={classes['buttons-container']}>
          <ConnectWallet
            className={classes['connect-button']}
            theme="light"
          />
        </Group>
      </Container>
    </AppShell.Header>
  )
}
