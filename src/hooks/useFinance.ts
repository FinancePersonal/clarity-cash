import { useState, useEffect, useCallback } from 'react';
import { FinanceState, Expense, BudgetRule } from '@/types/finance';

const STORAGE_KEY = 'fintrack-data';

const defaultState: FinanceState = {
  income: 0,
  budgetRule: { essentials: 50, personal: 30, investments: 20 },
  expenses: [],
  creditCardLimit: 0,
  creditCardUsed: 0,
  isOnboarded: false,
};

export function useFinance() {
  const [state, setState] = useState<FinanceState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        expenses: parsed.expenses.map((e: Expense) => ({
          ...e,
          date: new Date(e.date),
        })),
      };
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const completeOnboarding = useCallback((income: number, budgetRule: BudgetRule, creditCardLimit: number) => {
    setState(prev => ({
      ...prev,
      income,
      budgetRule,
      creditCardLimit,
      isOnboarded: true,
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense],
      creditCardUsed: expense.paymentMethod === 'credit' 
        ? prev.creditCardUsed + expense.amount 
        : prev.creditCardUsed,
    }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setState(prev => {
      const expense = prev.expenses.find(e => e.id === id);
      return {
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id),
        creditCardUsed: expense?.paymentMethod === 'credit' 
          ? prev.creditCardUsed - expense.amount 
          : prev.creditCardUsed,
      };
    });
  }, []);

  const updateIncome = useCallback((income: number) => {
    setState(prev => ({ ...prev, income }));
  }, []);

  const updateBudgetRule = useCallback((budgetRule: BudgetRule) => {
    setState(prev => ({ ...prev, budgetRule }));
  }, []);

  const updateCreditCardLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, creditCardLimit: limit }));
  }, []);

  const resetData = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Computed values
  const currentMonthExpenses = state.expenses.filter(e => {
    const now = new Date();
    return e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear();
  });

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const essentialSpent = currentMonthExpenses
    .filter(e => e.type === 'essential')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const personalSpent = currentMonthExpenses
    .filter(e => e.type === 'personal')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const investmentSpent = currentMonthExpenses
    .filter(e => e.type === 'investment')
    .reduce((sum, e) => sum + e.amount, 0);

  const essentialBudget = (state.income * state.budgetRule.essentials) / 100;
  const personalBudget = (state.income * state.budgetRule.personal) / 100;
  const investmentBudget = (state.income * state.budgetRule.investments) / 100;

  const essentialRemaining = essentialBudget - essentialSpent;
  const personalRemaining = personalBudget - personalSpent;
  const investmentRemaining = investmentBudget - investmentSpent;

  const creditCardAvailable = state.creditCardLimit - state.creditCardUsed;
  const creditCardUsagePercent = state.creditCardLimit > 0 
    ? (state.creditCardUsed / state.creditCardLimit) * 100 
    : 0;

  const overallHealth = (): 'excellent' | 'good' | 'warning' | 'danger' => {
    const totalBudget = essentialBudget + personalBudget;
    const spent = essentialSpent + personalSpent;
    const percent = totalBudget > 0 ? (spent / totalBudget) * 100 : 0;
    
    if (percent <= 70) return 'excellent';
    if (percent <= 90) return 'good';
    if (percent <= 100) return 'warning';
    return 'danger';
  };

  return {
    ...state,
    completeOnboarding,
    addExpense,
    removeExpense,
    updateIncome,
    updateBudgetRule,
    updateCreditCardLimit,
    resetData,
    currentMonthExpenses,
    totalSpent,
    essentialSpent,
    personalSpent,
    investmentSpent,
    essentialBudget,
    personalBudget,
    investmentBudget,
    essentialRemaining,
    personalRemaining,
    investmentRemaining,
    creditCardAvailable,
    creditCardUsagePercent,
    overallHealth: overallHealth(),
  };
}
