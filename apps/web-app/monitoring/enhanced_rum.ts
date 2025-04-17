// Advanced Real User Monitoring with segmentation and beacon API

import { onCLS, onFID, onLCP, onINP, onTTFB } from 'web-vitals';
import { v4 as uuidv4 } from 'uuid';

// Session and user tracking
let sessionId: string;
const userId = localStorage.getItem('rum_user_id') || uuidv4();
localStorage.setItem('rum_user_id', userId);

// Initialize new session
function initSession() {
  sessionId = uuidv4();
  sessionStorage.setItem('rum_session_id', sessionId);
}

// Get or initialize session
function getSession() {
  sessionId = sessionStorage.getItem('rum_session_id') || uuidv4();
  if (!sessionId) initSession();
  return sessionId;
}

// Extract connection information
function getConnectionInfo() {
  const conn = navigator.connection as any;
  if (!conn) return { type: 'unknown', rtt: null, downlink: null };
  
  return {
    type: conn.effectiveType || conn.type || 'unknown',
    rtt: conn.rtt,
    downlink: conn.downlink,
    saveData: conn.saveData
  };
}

// Get URL attributes (without PII)
function getSafeUrl() {
  const url = new URL(window.location.href);
  // Remove any potential PII from URL (like query params with emails, etc)
  url.search = '';
  url.hash = '';
  return url.toString();
}

// Get device/browser information
function getDeviceInfo() {
  return {
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio,
    userAgent: navigator.userAgent,
    vendor: navigator.vendor
  };
}

// Get A/B test variant
function getAbVariant() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)ab_variant\s*\=\s*([^;]*).*$)|^.*$/, "$1") || null;
}

// Send data to analytics endpoint
function sendToAnalytics(metric: any) {
  // Enrich with contextual information
  const enrichedMetric = {
    ...metric,
    timestamp: Date.now(),
    userId,
    sessionId: getSession(),
    url: getSafeUrl(),
    device: getDeviceInfo(),
    connection: getConnectionInfo(),
    ab_variant: getAbVariant()
  };
  
  // Use Beacon API for reliable delivery, falling back to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/rum', JSON.stringify(enrichedMetric));
  } else {
    fetch('/api/rum', {
      method: 'POST',
      body: JSON.stringify(enrichedMetric),
      keepalive: true
    });
  }
}

// Navigation timing metrics
function collectNavigationTiming() {
  // Wait for the document to be fully loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => setTimeout(collectNavigationTiming, 0));
    return;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return;
  
  const navigationMetrics = {
    name: 'navigation-timing',
    value: navigation.duration,
    timeToFirstByte: navigation.responseStart - navigation.requestStart,
    domInteractive: navigation.domInteractive - navigation.startTime,
    domComplete: navigation.domComplete - navigation.startTime,
    loadEvent: navigation.loadEventEnd - navigation.startTime,
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpHandshake: navigation.connectEnd - navigation.connectStart,
    serverResponse: navigation.responseEnd - navigation.responseStart,
    firstContentfulPaint: 0, // Will be replaced by web-vitals
  };
  
  // Send navigation timing
  sendToAnalytics(navigationMetrics);
}

// Initialize all metrics collection
export function initRUM() {
  // Initialize session if needed
  getSession();
  
  // Core Web Vitals
  onCLS(metric => sendToAnalytics({name: 'CLS', value: metric.value, ...metric}));
  onFID(metric => sendToAnalytics({name: 'FID', value: metric.value, ...metric}));
  onLCP(metric => sendToAnalytics({name: 'LCP', value: metric.value, ...metric}));
  onINP(metric => sendToAnalytics({name: 'INP', value: metric.value, ...metric}));
  onTTFB(metric => sendToAnalytics({name: 'TTFB', value: metric.value, ...metric}));
  
  // Navigation timing
  collectNavigationTiming();
  
  // Track route changes 
  if (typeof window !== 'undefined') {
    let lastUrl = window.location.href;
    
    // Detect route changes in SPA
    const observer = new MutationObserver(() => {
      if (lastUrl !== window.location.href) {
        sendToAnalytics({
          name: 'route-change',
          value: performance.now(),
          from: lastUrl,
          to: window.location.href
        });
        lastUrl = window.location.href;
        
        // Re-collect navigation timing on route change
        collectNavigationTiming();
      }
    });
    
    observer.observe(document, { subtree: true, childList: true });
  }
  
  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    sendToAnalytics({
      name: 'visibility-change',
      value: document.visibilityState,
      timestamp: performance.now()
    });
  });
  
  // Track errors
  window.addEventListener('error', (event) => {
    sendToAnalytics({
      name: 'js-error',
      value: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: performance.now()
    });
  });
  
  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    sendToAnalytics({
      name: 'unhandled-rejection',
      value: event.reason?.message || 'Unhandled Promise Rejection',
      timestamp: performance.now()
    });
  });
}