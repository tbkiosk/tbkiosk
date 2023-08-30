import { AppShell } from '@mantine/core'

import Header from './components/header'
import Main from './components/main'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Mint Beep',
}

export default function Beep() {
  return (
    <AppShell
      h="100%"
      header={{ height: 72 }}
      padding={0}
    >
      <Header />
      <Main />
    </AppShell>
  )
}
