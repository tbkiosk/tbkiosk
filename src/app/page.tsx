import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk - Home',
}

const Home = () => {
  redirect('/projects')
}

export default Home
