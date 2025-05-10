import { useEffect, useState } from "react";
import * as Comlink from "comlink";

export function useDataProcessor() {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/dataProcessor.ts", import.meta.url),
      { type: "module" }
    );
    setApi(Comlink.wrap(worker));
    return () => worker.terminate();
  }, []);

  return api;
}