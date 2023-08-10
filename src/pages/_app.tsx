import Head from 'next/head'
import { QueryClientProvider } from '@tanstack/react-query'

import { MantineUIProvider } from '@/providers/mantine'

import { Fonts, ErrorBoundary } from '@/components'

import { queryClient } from '@/lib/query'

import type { AppProps } from 'next/app'

import '../styles/globals.css'

const App = ({ Component, pageProps: { ...pageProps } }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
    </Head>
    <MantineUIProvider>
      <Fonts />
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </MantineUIProvider>
  </QueryClientProvider>
)

export default App
