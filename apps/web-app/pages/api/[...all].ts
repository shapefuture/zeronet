import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Example: universal catch-all API with advanced SWR/multi-tier cache headers
  const result = { route: req.url, time: Date.now(), data: "demo" };

  res.setHeader(
    "Cache-Control", 
    "public, max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  // (Optional): Add ETag if possible
  const etag = Buffer.from(JSON.stringify(result)).toString('base64').slice(0, 16);
  res.setHeader("ETag", etag);

  // SWR logic: if client sent matching ETag, respond 304
  if (req.headers["if-none-match"] === etag) {
    res.status(304).end();
    return;
  }
  res.status(200).json(result);
}