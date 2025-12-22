export interface BudgetRule {
  essentials: number;
  personal: number;
  investments: number;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: Date;
  type: 'essential' | 'personal' | 'investment';
  paymentMethod: 'cash' | 'credit';
}

export type ExpenseCategory = 
  | 'housing'
  | 'food'
  | 'transport'
  | 'health'
  | 'education'
  | 'entertainment'
  | 'shopping'
  | 'subscription'
  | 'investment'
  | 'other';

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  budgetRule: BudgetRule;
  expenses: Expense[];
  creditCardLimit: number;
  creditCardUsed: number;
}

export interface FinanceState {
  income: number;
  budgetRule: BudgetRule;
  expenses: Expense[];
  creditCardLimit: number;
  creditCardUsed: number;
  isOnboarded: boolean;
}

export const categoryLabels: Record<ExpenseCategory, string> = {
  housing: 'Moradia',
  food: 'Alimentação',
  transport: 'Transporte',
  health: 'Saúde',
  education: 'Educação',
  entertainment: 'Lazer',
  shopping: 'Compras',
  subscription: 'Assinaturas',
  investment: 'Investimento',
  other: 'Outros',
};

export const categoryIcons: Record<ExpenseCategory, string> = {
  housing: '🏠',
  food: '🍽️',
  transport: '🚗',
  health: '💊',
  education: '📚',
  entertainment: '🎮',
  shopping: '🛍️',
  subscription: '📱',
  investment: '📈',
  other: '📋',
};
