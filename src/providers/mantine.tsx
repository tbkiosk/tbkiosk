import { MantineProvider, ColorSchemeProvider as MantineColorSchemeProvider, ColorScheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { useLocalStorage, useHotkeys } from '@mantine/hooks'

import type { SingleNode } from '@/types/react_node'

export const MantineUIProvider = ({ children }: SingleNode) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <MantineColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        {children}
      </MantineProvider>
    </MantineColorSchemeProvider>
  )
}
