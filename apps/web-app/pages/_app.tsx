import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { WebVitals } from 'web-vitals';
import { useEffect } from 'react';

function sendToAnalytics(metric: any) {
  fetch('/api/rum', {
    method: 'POST',
    body: JSON.stringify(metric),
    keepalive: true
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    WebVitals.getCLS(sendToAnalytics);
    WebVitals.getFID(sendToAnalytics);
    WebVitals.getLCP(sendToAnalytics);
    WebVitals.getINP && WebVitals.getINP(sendToAnalytics);
  }, []);
  return <Component {...pageProps} />
}
export default MyApp