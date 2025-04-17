import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple RUM receiver; in reality, would forward to RUM backend
  res.status(204).end();
}