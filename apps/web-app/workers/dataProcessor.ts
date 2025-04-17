// Web Worker for data processing (via Comlink)
import * as Comlink from 'comlink';

export const dataProcessor = {
  processData(data: number[]) {
    // Off-main-thread sum as an example
    return data.reduce((a, b) => a + b, 0);
  }
}
Comlink.expose(dataProcessor);