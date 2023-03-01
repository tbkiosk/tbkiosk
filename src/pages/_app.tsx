import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import { WalletProvider } from '@suiet/wallet-kit'
import { Web3Modal } from '@web3modal/react'
import { WagmiConfig } from 'wagmi'

import {
  SuiWalletConnectModalProvider,
  SuiWalletConnectModal,
} from '@/components'

import fetcher from '@/helpers/swr/fetcher'
import { ethereumClient, wagmiClient } from '@/lib/wallet_connect'

import type { AppProps } from 'next/app'

import '@suiet/wallet-kit/style.css'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

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
            <WagmiConfig client={wagmiClient}>
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
              projectId="e1b06f3326e6315db629550035607ce9"
              ethereumClient={ethereumClient}
            />
          </SuiWalletConnectModalProvider>
        </ProSidebarProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
)

export default App
