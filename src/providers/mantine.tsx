import { MantineProvider, ColorSchemeProvider as MantineColorSchemeProvider, ColorScheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useLocalStorage, useHotkeys } from '@mantine/hooks'

import { Fonts } from '@/components'

import type { SingleNode } from '@/types/react_node'

export const MantineUIProvider = ({ children }: SingleNode) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <MantineColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={() => void 0}
    >
      <MantineProvider
        theme={{ colorScheme, fontFamily: 'cera-variable' }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Fonts />
        <Notifications />
        {children}
      </MantineProvider>
    </MantineColorSchemeProvider>
  )
}
