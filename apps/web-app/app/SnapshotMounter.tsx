"use client";
import { useBinarySnapshot } from "../hooks/useBinarySnapshot";
import React, { useRef, useEffect } from "react";
import { morphDom } from "../utils/domMorph";

export default function SnapshotMounter({ url = "/api/binary-snapshot" }) {
  const html = useBinarySnapshot(url);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && html) {
      morphDom(ref.current, html);
    }
  }, [html]);

  return (
    <div className="border p-4 my-8">
      <h2>Morphed DOM Snapshot:</h2>
      <div ref={ref} />
    </div>
  );
}