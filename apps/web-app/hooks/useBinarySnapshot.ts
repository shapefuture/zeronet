import { DOMSnapshot } from "../loader/UISnapshot/DOMSnapshot";
import { useEffect, useState } from "react";
import { logVerbose, logError } from "../utils/verboseLogger";

export function useBinarySnapshot(url: string) {
  const [html, setHtml] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    logVerbose("Fetching binary snapshot from", url);
    fetch(url, { headers: { Accept: "application/octet-stream" } })
      .then(async r => r.arrayBuffer())
      .then(buf => {
        try {
          const FlatBuffer = require("flatbuffers").ByteBuffer;
          const bb = new FlatBuffer(new Uint8Array(buf));
          const snap = DOMSnapshot.getRootAsDOMSnapshot(bb);
          logVerbose("Decoded DOMSnapshot:", snap);
          if (!cancelled) setHtml(snap.html());
        } catch (e) {
          logError("Binary snapshot decode failed, falling back", e);
          fetch("/api/classic-snapshot").then(r=>r.text()).then(setHtml);
        }
      }).catch((err) => {
        logError("Fetch error for binary snapshot", err);
        fetch("/api/classic-snapshot").then(r=>r.text()).then(setHtml);
      });
    return () => { cancelled = true };
  }, [url]);
  return html;
}
