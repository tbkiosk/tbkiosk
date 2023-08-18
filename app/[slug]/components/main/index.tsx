'use client'

import { AppShell } from '@mantine/core'

import classes from './styles.module.css'

type SlugMainProps = {
  slug: string
}

export default function SlugMain({ slug }: SlugMainProps) {
  return (
    <AppShell.Main className={classes.main}>
      <h1>{slug}</h1>
    </AppShell.Main>
  )
}
