import type { VercelRequest, VercelResponse } from "@vercel/node";

const users = new Map();

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  switch (req.method) {
    case 'GET':
      { const data = users.get(userId);
      return data ? res.json(data) : res.status(404).json({ error: 'Not found' }); }

    case 'PUT':
      users.set(userId, { ...req.body, updatedAt: new Date().toISOString() });
      return res.json({ success: true });

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}