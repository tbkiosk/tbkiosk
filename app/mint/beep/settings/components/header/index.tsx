'use client'

import { AppShell, Container, Box } from '@mantine/core'
import { ConnectWallet } from '@thirdweb-dev/react'
import cx from 'classix'

import classes from './styles.module.css'

export default function BeepSettingsHeader({ transparent }: { transparent?: boolean }) {
  return (
    <AppShell.Header
      className={cx(classes.header, transparent && classes.transparent)}
      withBorder={false}
      zIndex={1500}
    >
      <Container className={cx(classes.container, transparent && classes.transparent)}>
        <Box
          className={classes['logo-wrapper']}
          visibleFrom="sm"
        >
          BEEP
        </Box>
        <ConnectWallet
          className={classes['connect-button']}
          theme="light"
        />
      </Container>
    </AppShell.Header>
  )
}
