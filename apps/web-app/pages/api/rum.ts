import type { NextApiRequest, NextApiResponse } from "next";
// Write incoming metrics to a local (file-based) metrics store for demo, or to external service in prod
const globalMetrics: any[] = [];
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      let data = req.body;
      if (typeof data === "string") data = JSON.parse(data);
      globalMetrics.push(data);
      // In prod: send to analytics backend, S3, or RUM solution
      res.status(204).end();
    } catch (e) {
      res.status(400).end();
    }
  } else {
    res.status(405).end();
  }
}