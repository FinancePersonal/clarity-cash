import { api } from './api';

export type FinanceDivisionType = 'RULE_50_30_20' | 'RULE_50_20_30' | 'RULE_40_30_30' | 'CUSTOM';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  objectives?: string;
  salary?: number;
  financeDivisionType: FinanceDivisionType;
  billsPercentage: number;
  expensesPercentage: number;
  investmentsPercentage: number;
}

export interface UpdateProfileRequest {
  name?: string;
  objectives?: string;
  salary?: number;
  financeDivisionType: FinanceDivisionType;
  billsPercentage?: number;
  expensesPercentage?: number;
  investmentsPercentage?: number;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users');
  },

  async listUsers(): Promise<UserProfile[]> {
    const response = await api.get('/users');
    return response.data;
  },
};
