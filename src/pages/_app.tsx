import { SessionProvider } from "next-auth/react";
import { WalletProvider } from "@suiet/wallet-kit";
import { SWRConfig } from "swr";
import { Tooltip } from "react-tooltip";
import { ProSidebarProvider } from "react-pro-sidebar";
import { ToastContainer } from "react-toastify";

import type { AppProps } from "next/app";

import "@suiet/wallet-kit/style.css";
import "react-tooltip/dist/react-tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SWRConfig
    value={{
      fetcher: async (...args: Parameters<typeof fetch>): Promise<JSON> =>
        fetch(...args).then((res) => res.json()),
    }}
  >
    <WalletProvider autoConnect={false}>
      <SessionProvider session={session}>
        <ProSidebarProvider>
          <Component {...pageProps} />
          <Tooltip anchorId="tooltip" />
          <ToastContainer />
        </ProSidebarProvider>
      </SessionProvider>
    </WalletProvider>
  </SWRConfig>
);

export default App;
