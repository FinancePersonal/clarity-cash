import type { VercelRequest, VercelResponse } from "@vercel/node";
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client.db('clarity-cash');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'User ID required' });

  try {
    const db = await connectDB();
    const collection = db.collection('users');

    switch (req.method) {
      case 'GET':
        const user = await collection.findOne({ userId });
        if (!user) {
          return res.status(404).json({ error: 'Not found' });
        }
        // Retornar os dados sem o _id e userId
        const { _id, userId: uid, ...userData } = user;
        return res.json(userData);

      case 'PUT':
        await collection.updateOne(
          { userId },
          { $set: { ...req.body, userId, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.json({ success: true });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}