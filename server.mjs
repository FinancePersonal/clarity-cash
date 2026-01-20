import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
let db;

client.connect().then(() => {
  db = client.db('clarity-cash');
  console.log('Connected to MongoDB');
});

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

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
        isOnboarded: false,
        selectedMonth: new Date()
      }
    });

    res.status(201).json({ 
      userId: result.insertedId,
      email,
      name: name || email.split('@')[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      token,
      userId: user._id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get finance data
app.get('/api/finance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.financeData || {});
  } catch (error) {
    console.error('Get finance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save finance data
app.put('/api/finance', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    const financeData = req.body;

    await db.collection('users').updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { financeData, updatedAt: new Date() } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save finance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
