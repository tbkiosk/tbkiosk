import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'
import { WalletProvider } from '@suiet/wallet-kit'

import fetcher from '@/helpers/swr/fetcher'

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
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Component {...pageProps} />
          <ToastContainer />
        </ProSidebarProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
)

export default App
