import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

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
    const users = db.collection('users');

    switch (req.method) {
      case 'GET':
        const user = await users.findOne({ _id: new ObjectId(userId as string) });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const { _id, email, password, name, createdAt, ...financeData } = user;
        return res.json(financeData);

      case 'PUT':
        await users.updateOne(
          { _id: new ObjectId(userId as string) },
          { $set: { ...req.body, updatedAt: new Date() } }
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