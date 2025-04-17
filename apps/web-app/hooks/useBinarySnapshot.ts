import { DOMSnapshot } from "../loader/UISnapshot/DOMSnapshot";
import { useEffect, useState } from "react";

export function useBinarySnapshot(url: string) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { headers: { Accept: "application/octet-stream" } })
      .then(async r => r.arrayBuffer())
      .then(buf => {
        const bb = new (require('flatbuffers').ByteBuffer)(new Uint8Array(buf));
        const snap = DOMSnapshot.getRootAsDOMSnapshot(bb);
        if (!cancelled) setHtml(snap.html());
      });
    return () => { cancelled = true };
  }, [url]);

  return html;
}