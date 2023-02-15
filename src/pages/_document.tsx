import { Html, Head, Main, NextScript } from "next/document";

const Document = () => (
  <Html lang="en">
    <Head>
      <meta name="description" content="morphis social" />
      <link rel="icon" href="/morphis-logo.ico" />
      <script
        async
        crossOrigin="anonymous"
        src="https://kit.fontawesome.com/0ed81646db.js"
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
