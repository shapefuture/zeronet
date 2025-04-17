import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const snapApiUrl = "http://localhost:8000/render_snapshot";
  const payload = { url: "http://example.com" };
  const snapRes = await fetch(snapApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/octet-stream" },
    body: JSON.stringify(payload),
  });
  const buf = await snapRes.arrayBuffer();
  res.status(200).setHeader("Content-Type", "application/octet-stream").send(Buffer.from(buf));
}