import { trace } from '@opentelemetry/api';

export async function tracedFetch(url: string, options: RequestInit = {}) {
  const span = trace.getTracer('web-app').startSpan(`fetch:${url}`);
  try {
    const res = await fetch(url, options);
    span.setStatus({ code: 1 }); // OK
    return res;
  } catch (err: any) {
    span.recordException(err);
    span.setStatus({ code: 2, message: err.message });
    throw err;
  } finally {
    span.end();
  }
}