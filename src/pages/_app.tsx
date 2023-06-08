import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { SWRConfig } from 'swr'

import { wagmiConfig } from '@/lib/wagmi'

import fetcher from '@/utils/fetcher'

import type { AppProps } from 'next/app'

import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={[mainnet, polygon]}>
      <SessionProvider session={session}>
        <SWRConfig value={{ fetcher }}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
          <ToastContainer />
        </SWRConfig>
      </SessionProvider>
    </RainbowKitProvider>
  </WagmiConfig>
)

export default App
