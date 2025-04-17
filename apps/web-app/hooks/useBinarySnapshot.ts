import { DOMSnapshot } from "../loader/UISnapshot/DOMSnapshot";
import { useEffect, useState } from "react";

export function useBinarySnapshot(url: string) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url, { headers: { Accept: "application/octet-stream" } })
      .then(async r => r.arrayBuffer())
      .then(buf => {
        try {
          const FlatBuffer = require("flatbuffers").ByteBuffer;
          const bb = new FlatBuffer(new Uint8Array(buf));
          const snap = DOMSnapshot.getRootAsDOMSnapshot(bb);
          if (!cancelled) setHtml(snap.html());
        } catch (e) {
          // Progressive enhancement: fallback to classic HTML endpoint
          fetch("/api/classic-snapshot").then(r=>r.text()).then(setHtml);
        }
      }).catch(() => {
        // On fetch error, fallback
        fetch("/api/classic-snapshot").then(r=>r.text()).then(setHtml);
      });
    return () => { cancelled = true };
  }, [url]);
  return html;
}