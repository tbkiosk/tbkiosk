'use client'

import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'

export default function ColorSchemeHotKey() {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light')

  useHotkeys([['mod+J', () => (computedColorScheme === 'light' ? setColorScheme('dark') : setColorScheme('light'))]])

  return null
}
