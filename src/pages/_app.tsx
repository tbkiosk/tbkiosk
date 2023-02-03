import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <Component {...pageProps} />
  </SessionProvider>
);

export default App;
