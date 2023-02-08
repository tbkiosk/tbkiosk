import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@suiet/wallet-kit";
import { SWRConfig } from "swr";

import type { AppProps } from "next/app";

import "@suiet/wallet-kit/style.css";
import "../styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <WalletProvider>
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          fetcher: async (...args: Parameters<typeof fetch>): Promise<JSON> =>
            fetch(...args).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  </WalletProvider>
);

export default App;
