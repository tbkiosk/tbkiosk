import { Html, Head, Main, NextScript } from 'next/document'

const Document = () => (
  <Html lang="en">
    <Head>
      <meta
        name="description"
        content="morphis network"
      />
      <link
        rel="icon"
        href="/favicon.ico?v=2"
      />
      <script
        crossOrigin="anonymous"
        defer
        src="https://kit.fontawesome.com/205d88d001.js"
      />
    </Head>
    <body>
      <Main />
      <div id="portal" />
      <NextScript />
    </body>
  </Html>
)

export default Document
