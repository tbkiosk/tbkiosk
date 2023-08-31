'use client'

import { AppShell, Container, Box, Image } from '@mantine/core'
import { ConnectWallet } from '@thirdweb-dev/react'

import classes from './styles.module.css'

export default function BeepSettingsHeader() {
  return (
    <AppShell.Header
      className={classes.header}
      withBorder={false}
      zIndex={1500}
    >
      <Container className={classes.container}>
        <Box
          className={classes['logo-wrapper']}
          visibleFrom="sm"
        >
          <Image
            alt="beep"
            className={classes.logo}
            src="/beep-logo.svg"
          />
        </Box>
        <ConnectWallet
          className={classes['connect-button']}
          theme="light"
        />
      </Container>
    </AppShell.Header>
  )
}
