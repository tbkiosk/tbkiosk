import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Home',
}

export default function Home() {
  redirect('/projects')
  return null
}
