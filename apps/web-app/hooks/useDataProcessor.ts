import { useEffect, useRef } from "react";
import * as Comlink from "comlink";

export function useDataProcessor() {
  const workerRef = useRef<any>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/dataProcessor.ts", import.meta.url),
      { type: "module" }
    );
    // Clean up
    return () => workerRef.current && workerRef.current.terminate();
  }, []);

  return async (data: number[]) => {
    if (workerRef.current) {
      const api = Comlink.wrap<{ processData(data: number[]): Promise<number> }>(workerRef.current);
      return await api.processData(data);
    }
    return null;
  }
}