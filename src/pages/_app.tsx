import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import { WalletProvider } from '@suiet/wallet-kit'
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'

import { SuiWalletConnectModalProvider, SuiWalletConnectModal } from '@/components'

import fetcher from '@/utils/fetcher'
import { ethereumClient, wagmiConfig } from '@/lib/wallet_connect'

import type { AppProps } from 'next/app'

import '@suiet/wallet-kit/style.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'
import { env } from '@/env.mjs'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SWRConfig
    value={{
      fetcher,
    }}
  >
    <WalletProvider autoConnect>
      <SessionProvider session={session}>
        <ProSidebarProvider>
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
        </ProSidebarProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
)

export default App
