import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database (para MVP - substituir por MongoDB depois)
const users = new Map();

const JWT_SECRET = 'mvp_secret_key_change_in_production';

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    if (users.has(email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    
    users.set(email, {
      id: userId,
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

    console.log(`✅ User registered: ${email}`);
    res.status(201).json({ 
      userId,
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

    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email}`);
    res.status(200).json({ 
      token,
      userId: user.id,
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

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    
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

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(users.values()).find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.financeData = req.body;
    user.updatedAt = new Date();

    console.log(`💾 Finance data saved for: ${user.email}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Save finance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Clarity Cash API running on http://localhost:${PORT}`);
  console.log(`📝 In-memory database (data will be lost on restart)`);
  console.log(`✨ Ready to accept requests!\n`);
});
