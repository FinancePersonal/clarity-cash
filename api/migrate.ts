import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db('clarity-cash');
    const users = db.collection('users');
    const financeData = db.collection('finance-data');

    // Buscar todos os dados financeiros
    const allFinanceData = await financeData.find({}).toArray();
    
    let migrated = 0;
    
    for (const finance of allFinanceData) {
      const { _id, userId, ...financeFields } = finance;
      
      // Atualizar usuário com dados financeiros
      const result = await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: financeFields }
      );
      
      if (result.modifiedCount > 0) {
        migrated++;
      }
    }

    return res.json({ 
      success: true, 
      message: `Migrated ${migrated} finance records to users collection` 
    });

  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({ error: 'Migration failed' });
  } finally {
    await client.close();
  }
}