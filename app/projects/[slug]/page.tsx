import { AppShell } from '@mantine/core'

import Header from 'components/header'
import SlugMain from './components/main'

import type { Metadata } from 'next'

type ProjectSlugProps = {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectSlugProps): Promise<Metadata> {
  return {
    title: `Kiosk - Project ${params.slug}`,
  }
}

export default function ProjectSlug({ params }: ProjectSlugProps) {
  return (
    <AppShell
      h="100%"
      header={{ height: 72 }}
      padding={0}
    >
      <Header />
      <SlugMain slug={params.slug} />
    </AppShell>
  )
}
