import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import 'swiper/css'
import 'swiper/css/pagination'
import './global.css'

import Script from 'next/script'
import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import ColorSchemeHotKey from 'components/color_scheme_hot_key'
import Providers from './providers'

import type { Metadata } from 'next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/205d88d001.js"
        />
        <ColorSchemeScript
          defaultColorScheme="dark"
          nonce="8IBTHwOdqNKAWeKl7plt8g=="
        />
        <meta
          name="twitter:card"
          content="summary"
        />
        <meta
          name="twitter:site"
          content="@tbkisk"
        />
        <meta
          name="twitter:creator"
          content="@tbkiosk"
        />
        <meta
          property="og:url"
          content="https://tbkiosk.xyz"
        />
        <meta
          property="og:title"
          content="Kiosk"
        />
        <meta
          property="og:description"
          content="Kiosk"
        />
        <meta
          property="og:image"
          content="https://tbkiosk.xyz/images/banner.png"
        />
        <link
          rel="shortcut icon"
          href="/favicon.ico"
        />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          theme={{ fontFamily: 'cera-variable' }}
        >
          <Providers>
            {children}
            <div id="portal" />
          </Providers>
          <Notifications zIndex={9999} />
          <ColorSchemeHotKey />
        </MantineProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'Kiosk',
  description: 'Digital ownership and utilities, powered by ERC 6551',
  keywords: ['NFT', 'ERC 6551', 'ETH', 'Web3'],
}
