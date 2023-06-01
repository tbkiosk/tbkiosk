import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import { WalletProvider } from '@suiet/wallet-kit'
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'

import { SuiWalletConnectModalProvider, SuiWalletConnectModal } from '@/components'

import fetcher from '@/utils/fetcher'
import { ethereumClient, wagmiConfig } from '@/lib/wallet_connect'
import { env } from '@/env.mjs'

import type { AppProps } from 'next/app'

import '@suiet/wallet-kit/style.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SWRConfig
    value={{
      fetcher,
    }}
  >
    <WalletProvider autoConnect>
      <SessionProvider session={session}>
        <SuiWalletConnectModalProvider>
          <WagmiConfig config={wagmiConfig}>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <Component {...pageProps} />
            <ToastContainer />
            <SuiWalletConnectModal />
          </WagmiConfig>
          <Web3Modal
            projectId={env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}
            ethereumClient={ethereumClient}
          />
        </SuiWalletConnectModalProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
)

export default App
