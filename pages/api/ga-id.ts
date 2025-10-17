import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const gaId = process.env.GOOGLE_ANALYTICS_ID || null;
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ gaId });
}

