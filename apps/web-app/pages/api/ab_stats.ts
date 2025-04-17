import type { NextApiRequest, NextApiResponse } from "next";
const FAKE_AB_STATS = {
  A: { visitors: 500, lcp_avg: 875, inp_avg: 180 },
  B: { visitors: 480, lcp_avg: 920, inp_avg: 192 }
};
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // In prod, aggregate stats from RUM/analytics data store
  res.status(200).json(FAKE_AB_STATS);
}