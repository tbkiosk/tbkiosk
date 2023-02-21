import { SessionProvider } from 'next-auth/react'
import { WalletProvider } from '@suiet/wallet-kit'
import { SWRConfig } from 'swr'
import { ProSidebarProvider } from 'react-pro-sidebar'
import { ToastContainer } from 'react-toastify'

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
          <Component {...pageProps} />
          <ToastContainer />
        </ProSidebarProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
)

export default App
