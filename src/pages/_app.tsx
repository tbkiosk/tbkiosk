import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { RainbowKitSiweNextAuthProvider, GetSiweMessageOptions } from '@rainbow-me/rainbowkit-siwe-next-auth'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { WalletProvider } from '@suiet/wallet-kit'

import { AggregatedMantineProvider } from '@/providers/aggregated_mantine_provider'

import ErrorBoundary from './error_boundary'

import { wagmiConfig } from '@/lib/wagmi'
import { queryClient } from '@/lib/query'

import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css'
import '@suiet/wallet-kit/style.css'
import '../styles/globals.css'

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to Morphis Airdawg',
})

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <WagmiConfig config={wagmiConfig}>
    <SessionProvider session={session}>
      <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
        <RainbowKitProvider chains={[mainnet, polygon]}>
          <WalletProvider>
            <QueryClientProvider client={queryClient}>
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
              </Head>
              <AggregatedMantineProvider>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </AggregatedMantineProvider>
            </QueryClientProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </RainbowKitSiweNextAuthProvider>
    </SessionProvider>
  </WagmiConfig>
)

export default App
