'use client'

import Link from 'next/link'
import { AppShell, Container, Box, Group } from '@mantine/core'
import { ConnectWallet } from '@thirdweb-dev/react'

import LogoWithText from 'public/logo_with_text.svg'
import Logo from 'public/logo.svg'

import classes from './styles.module.css'

export default function Header() {
  return (
    <AppShell.Header
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
            <LogoWithText />
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
            // detailsBtn={() => (
            //   <Button
            //     color="gray"
            //     radius="md"
            //     size="sm"
            //     variant="default"
            //   >
            //     {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
            //   </Button>
            // )}
            theme="light"
          />
        </Group>
      </Container>
    </AppShell.Header>
  )
}
