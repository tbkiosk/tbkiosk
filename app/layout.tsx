import '@mantine/core/styles.css'
import 'swiper/css'
import './index.css'

import { MantineProvider, ColorSchemeScript } from '@mantine/core'
import ColorSchemeHotKey from 'components/color_scheme_hot_key'

import type { Metadata } from 'next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript nonce="8IBTHwOdqNKAWeKl7plt8g==" />
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
          href="/favicon.icon"
        />
        <script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/205d88d001.js"
        />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          {children}
          <ColorSchemeHotKey />
          <div id="portal" />
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
