import Document, { Html, Head, Main, NextScript } from 'next/document'
import { createGetInitialProps } from '@mantine/next'

export const getInitialProps = createGetInitialProps()

export default class _Document extends Document {
  static getInitialProps = getInitialProps

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="kiosk"
          />
          <meta charSet="UTF-8" />
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
