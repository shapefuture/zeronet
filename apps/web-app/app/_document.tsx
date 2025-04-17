import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html>
      <Head>
        {/* DNS-Prefetch and Preconnect for critical origins */}
        <link rel="dns-prefetch" href="https://api.example.com" />
        <link rel="preconnect" href="https://api.example.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.example.com" crossOrigin="" />
        
        {/* Critical fonts with modern priority hints */}
        <link 
          rel="preload" 
          href="/fonts/optimized.woff2" 
          as="font" 
          type="font/woff2" 
          fetchPriority="high" 
          crossOrigin="" 
        />
        
        {/* Critical CSS */}
        <link 
          rel="preload" 
          href="/styles/critical.css" 
          as="style" 
          fetchPriority="high" 
        />
        <link rel="stylesheet" href="/styles/critical.css" />
        
        {/* Non-critical CSS loaded asynchronously */}
        <link 
          rel="preload" 
          href="/styles/non-critical.css" 
          as="style" 
          fetchPriority="low" 
          media="print" 
          onLoad="this.media='all'" 
        />
        
        {/* Prefetch next likely pages (static hint) */}
        <link rel="prefetch" href="/about" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}