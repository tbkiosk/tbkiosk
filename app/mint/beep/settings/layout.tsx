import { AppShell } from '@mantine/core'

import Header from './components/header'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Beep Settings',
}

export default function BeepSettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      h="100%"
      header={{ height: 72 }}
      padding={0}
    >
      <Header />
      {children}
    </AppShell>
  )
}
