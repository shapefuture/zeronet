import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://api.example.com" crossOrigin="" />
        <link rel="preload" as="font" href="/fonts/optimized.woff2" type="font/woff2" crossOrigin="" />
        <link rel="preload" as="style" href="/styles/critical.css" />
        <link rel="stylesheet" href="/styles/critical.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}