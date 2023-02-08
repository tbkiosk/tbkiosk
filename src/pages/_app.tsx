import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@suiet/wallet-kit";
import { SWRConfig } from "swr";

import type { AppProps } from "next/app";

import "@suiet/wallet-kit/style.css";
import "../styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SWRConfig
    value={{
      fetcher: async (...args: Parameters<typeof fetch>): Promise<JSON> =>
        fetch(...args).then((res) => res.json()),
    }}
  >
    <WalletProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
);

export default App;
