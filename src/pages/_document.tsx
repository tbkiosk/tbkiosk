import Document, { Html, Head, Main, NextScript } from 'next/document'
import { createGetInitialProps } from '@mantine/next'

export const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="description"
            content="kiosk"
          />
          <meta
            name="twitter:card"
            content="summary"
          />
          <meta
            name="twitter:site"
            content="@tbkisk"
          />
          <meta
            name="twitter:creator"
            content="@tbkiosk"
          />
          <meta
            property="og:url"
            content="https://tbkiosk.xyz"
          />
          <meta
            property="og:title"
            content="Kiosk"
          />
          <meta
            property="og:description"
            content="Kiosk"
          />
          <meta
            property="og:image"
            content="https://tbkiosk.xyz/images/banner.png"
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
  }
}
