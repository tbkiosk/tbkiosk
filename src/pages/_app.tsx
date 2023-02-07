import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@suiet/wallet-kit";

import type { AppProps } from "next/app";

import "@suiet/wallet-kit/style.css";
import "../styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <WalletProvider>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </WalletProvider>
);

export default App;
