"use client";
import React, { useState } from "react";
export default function CounterIsland() {
  const [n, setN] = useState(0);
  return (
    <button data-island onClick={() => setN(n+1)}>Counter (island): {n}</button>
  );
}