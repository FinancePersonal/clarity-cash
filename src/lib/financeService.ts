import { FinanceState } from '@/types/finance';
import { API_CONFIG } from './authService';

class FinanceService {
  // Placeholder methods - to be implemented with Java API
  async saveUserData(userId: string, data: FinanceState): Promise<void> {
    // TODO: Implement with Java API
    console.log('Save data will be implemented with Java API:', { userId, data });
  }

  async getUserData(userId: string): Promise<FinanceState | null> {
    // TODO: Implement with Java API
    console.log('Get user data will be implemented with Java API:', userId);
    return null;
  }

  async syncData(userId: string, localData: FinanceState): Promise<FinanceState> {
    // TODO: Implement with Java API
    console.log('Sync data will be implemented with Java API:', { userId, localData });
    return localData;
  }

  // Helper method to get API endpoints
  getEndpoints() {
    return API_CONFIG.endpoints;
  }

  // Helper method to get base URL
  getBaseUrl() {
    return API_CONFIG.baseUrl;
  }
}

export const financeService = new FinanceService();