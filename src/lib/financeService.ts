import { FinanceState } from '@/types/finance';
import { authService } from './authService';

class FinanceService {
  private apiUrl = import.meta.env.VITE_API_URL || 'https://api.clarity-cash.com';

  async saveUserData(userId: string, data: FinanceState): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  }

  async getUserData(userId: string): Promise<FinanceState | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}/data`, {
        headers: {
          ...authService.getAuthHeaders(),
        },
      });
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error('Failed to load data');
      }

      const userData = await response.json();
      
      return {
        income: userData.income,
        budgetRule: userData.budgetRule,
        expenses: userData.expenses.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        })),
        incomes: userData.incomes.map((i: any) => ({
          ...i,
          date: new Date(i.date),
        })),
        recurringTransactions: userData.recurringTransactions,
        creditCards: userData.creditCards,
        goals: userData.goals || [],
        alerts: userData.alerts || [],
        plannedPurchases: userData.plannedPurchases || [],
        isOnboarded: userData.isOnboarded,
        selectedMonth: new Date(),
      };
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  async syncData(userId: string, localData: FinanceState): Promise<FinanceState> {
    try {
      const cloudData = await this.getUserData(userId);
      
      if (!cloudData) {
        await this.saveUserData(userId, localData);
        return localData;
      }

      const mergedData: FinanceState = {
        ...cloudData,
        selectedMonth: localData.selectedMonth,
      };

      return mergedData;
    } catch (error) {
      console.error('Error syncing data:', error);
      return localData;
    }
  }
}

export const financeService = new FinanceService();