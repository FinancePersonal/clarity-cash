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
    const users = db.collection('users');
    const financeData = db.collection('finance-data');

    switch (req.method) {
      case 'GET':
        // Buscar usuário na collection users
        { const user = await users.findOne({ _id: new client.db().admin().command({ convertToCapped: false }).constructor.ObjectId ? new (await import('mongodb')).ObjectId(userId.replace('user_', '')) : null });
        if (!user) {
          // Buscar por userId customizado se não encontrar por ObjectId
          const userByCustomId = await users.findOne({ id: userId });
          if (!userByCustomId) {
            return res.status(404).json({ error: 'User not found' });
          }
          // Buscar dados financeiros usando o _id do usuário
          const financeDoc = await financeData.findOne({ userId: userByCustomId._id.toString() });
          return financeDoc ? res.json(financeDoc) : res.status(404).json({ error: 'Finance data not found' });
        }

        // Buscar dados financeiros usando o _id do usuário
        const financeDoc = await financeData.findOne({ userId: user._id.toString() });
        return financeDoc ? res.json(financeDoc) : res.status(404).json({ error: 'Finance data not found' }); }

      case 'PUT':
        // Buscar usuário para pegar o _id
        { const userForUpdate = await users.findOne({ id: userId });
        if (!userForUpdate) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Salvar dados financeiros na collection finance-data
        await financeData.updateOne(
          { userId: userForUpdate._id.toString() },
          { $set: { ...req.body, userId: userForUpdate._id.toString(), updatedAt: new Date() } },
          { upsert: true }
        );
        return res.json({ success: true }); }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}