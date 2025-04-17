"use client";
import React, { useEffect, useState } from "react";

export function AbTestStats() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    fetch("/api/ab_stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);
  return (
    <section>
      <h3>A/B Test Results</h3>
      {!stats ? (
        <div>Loading…</div>
      ) : (
        <ul>
          {Object.entries(stats).map(([variant, info]: [string, any]) => (
            <li key={variant}>
              Variant <strong>{variant}</strong>: Visitors = {info.visitors}, LCP = {info.lcp_avg.toFixed(2)} ms, INP = {info.inp_avg.toFixed(2)} ms
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}