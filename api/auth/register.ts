import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../lib/mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const client = await clientPromise;
    const db = client.db('clarity-cash');
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: new Date(),
      financeData: {
        income: 0,
        budgetRule: { essentials: 50, personal: 30, investments: 20 },
        expenses: [],
        incomes: [],
        investments: [],
        recurringTransactions: [],
        creditCards: [],
        goals: [],
        isOnboarded: false
      }
    });

    return res.status(201).json({ 
      userId: result.insertedId,
      email,
      name: name || email.split('@')[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
