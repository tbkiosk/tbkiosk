import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import ErrorBoundary from './error_boundary'

import { wagmiConfig } from '@/lib/wagmi'

import type { AppProps } from 'next/app'

import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Morphis Airdawg',
})

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <WagmiConfig config={wagmiConfig}>
    <SessionProvider session={session}>
      <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
        <RainbowKitProvider chains={[mainnet, polygon]}>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
          <ToastContainer />
        </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
    </SessionProvider>
  </WagmiConfig>
)

export default App
