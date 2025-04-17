import SnapshotMounter from "./SnapshotMounter";
import dynamic from "next/dynamic";
const CounterIsland = dynamic(() => import("../islands/Counter.island"), { ssr: false });

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Ultra-Low Latency Web App Starter</h1>
      <p>Next.js + Tailwind + Shadcn + (Langchain.js, Vercel AI SDK ready)</p>
      <SnapshotMounter url="/api/binary-snapshot" />
      <CounterIsland />
    </main>
  );
}