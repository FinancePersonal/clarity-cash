// Configuration for Java API integration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  endpoints: {
    // Authentication endpoints (to be implemented)
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout'
    },
    // User data endpoints (to be implemented)
    user: {
      profile: '/user/profile',
      financeData: '/user/finance-data'
    },
    // Finance endpoints (to be implemented)
    finance: {
      expenses: '/finance/expenses',
      incomes: '/finance/incomes',
      creditCards: '/finance/credit-cards',
      goals: '/finance/goals'
    }
  }
};

interface User {
  id: string;
  email: string;
  name: string;
}

class AuthService {
  private tokenKey = 'clarity-cash-token';
  private userKey = 'clarity-cash-user';

  // Placeholder methods - to be implemented with Java API
  async register(email: string, password: string, name: string): Promise<any> {
    throw new Error('Authentication will be implemented with Java API');
  }

  async login(email: string, password: string): Promise<any> {
    throw new Error('Authentication will be implemented with Java API');
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
export { API_CONFIG };