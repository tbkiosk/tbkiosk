import ThirdwebProvider from '@/providers/thirdweb'
import NextUIProvider from '@/providers/nextui'
import Toastify from '@/providers/toastify'

import 'swiper/css'
import 'swiper/css/pagination'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kiosk',
  description: 'Digital ownership and utilities, powered by ERC 6551',
  keywords: ['NFT', 'ERC 6551', 'ETH', 'Web3'],
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
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
    <body>
      <ThirdwebProvider>
        <NextUIProvider>
          {children}
          <Toastify />
        </NextUIProvider>
      </ThirdwebProvider>
    </body>
  </html>
)

export default RootLayout
