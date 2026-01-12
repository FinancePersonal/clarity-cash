export interface BudgetRule {
  essentials: number;
  personal: number;
  investments: number;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  dueDay: number;
  color: string;
  isActive: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: Date;
  type: 'essential' | 'personal' | 'investment';
  paymentMethod: 'cash' | 'credit';
  creditCardId?: string;
  installments?: {
    total: number;
    current: number;
    originalAmount: number;
  };
  showInBankStatement?: boolean;
}

export interface Investment {
  id: string;
  amount: number;
  category: InvestmentCategory;
  description?: string;
  date: Date;
  month: number;
  year: number;
}

export interface Income {
  id: string;
  amount: number;
  description?: string;
  date: Date;
}

export interface RecurringTransaction {
  id: string;
  amount: number;
  category?: ExpenseCategory;
  description: string;
  type: 'expense' | 'income';
  expenseType?: 'essential' | 'personal' | 'investment';
  paymentMethod?: 'cash' | 'credit';
  frequency: 'monthly';
  isActive: boolean;
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

export type InvestmentCategory = 
  | 'fixed_income'
  | 'stocks'
  | 'real_estate_funds'
  | 'crypto'
  | 'other_investments';

export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  budgetRule: BudgetRule;
  expenses: Expense[];
  creditCardLimit: number;
  creditCardUsed: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  isActive: boolean;
  createdAt: Date;
  smartCriteria?: {
    specific: string;
    measurable: string;
    achievable: string;
    relevant: string;
    timebound: string;
  };
}

export interface Alert {
  id: string;
  type: 'budget_exceeded' | 'goal_deadline' | 'spending_spike' | 'card_limit';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  isRead: boolean;
  createdAt: Date;
}

export interface PlannedPurchase {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  plannedDate: Date;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  isCompleted: boolean;
}

export interface FinanceState {
  income: number;
  budgetRule: BudgetRule;
  expenses: Expense[];
  incomes: Income[];
  investments: Investment[];
  recurringTransactions: RecurringTransaction[];
  creditCards: CreditCard[];
  goals: Goal[];
  alerts: Alert[];
  plannedPurchases: PlannedPurchase[];
  isOnboarded: boolean;
  selectedMonth: Date;
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

export const investmentCategoryLabels: Record<InvestmentCategory, string> = {
  fixed_income: 'Renda Fixa',
  stocks: 'Ações',
  real_estate_funds: 'Fundos Imobiliários (FIIs)',
  crypto: 'Criptomoedas',
  other_investments: 'Outros Investimentos',
};

export const categoryIcons: Record<ExpenseCategory, string> = {
  housing: 'house',
  food: 'utensils',
  transport: 'car',
  health: 'heart-pulse',
  education: 'book',
  entertainment: 'gamepad-2',
  shopping: 'shopping-bag',
  subscription: 'smartphone',
  investment: 'trending-up',
  other: 'more-horizontal',
};

export const investmentCategoryIcons: Record<InvestmentCategory, string> = {
  fixed_income: 'building-2',
  stocks: 'trending-up',
  real_estate_funds: 'building',
  crypto: 'coins',
  other_investments: 'piggy-bank',
};
