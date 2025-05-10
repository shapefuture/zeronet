// Web Worker for data-processing: heavy JSON operation
import * as Comlink from 'comlink';

export const dataProcessor = {
  complexStats(data: number[]) {
    // Example: calculates mean and standard deviation
    if (!data.length) return { mean: 0, std: 0 };
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const std = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / data.length);
    return { mean, std };
  }
};
Comlink.expose(dataProcessor);