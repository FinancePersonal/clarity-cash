import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './lib/mongodb';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    const client = await clientPromise;
    const db = client.db('clarity-cash');

    if (req.method === 'GET') {
      const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user.financeData || {});
    }

    if (req.method === 'PUT') {
      const financeData = req.body;
      await db.collection('users').updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { financeData, updatedAt: new Date() } }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Finance data error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
