const API_URL = '/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const api = {
  async getFinanceData() {
    const response = await fetch(`${API_URL}/finance`, {
      headers: headers()
    });
    if (!response.ok) throw new Error('Failed to fetch finance data');
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  },

  async saveFinanceData(data: any) {
    const response = await fetch(`${API_URL}/finance`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save finance data');
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async register(email: string, password: string, name?: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  }
};
