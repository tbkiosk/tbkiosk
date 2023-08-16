import { AppShell } from '@mantine/core'

import Header from 'components/home/header'
import Main from 'components/home/main'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Home',
}

export default function Home() {
  return (
    <AppShell
      header={{ height: 72 }}
      padding={0}
    >
      <Header />
      <Main />
    </AppShell>
  )
}
