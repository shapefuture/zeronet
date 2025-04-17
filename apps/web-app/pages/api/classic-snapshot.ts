import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send("<div>Error loading binary snapshot. Fallback HTML used.</div>");
}