import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'
import { SWRConfig } from 'swr'

import fetcher from '@/utils/fetcher'

import type { AppProps } from 'next/app'

import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
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
)

export default App
