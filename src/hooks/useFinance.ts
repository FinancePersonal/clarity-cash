import { useState, useEffect, useCallback } from 'react';
import { FinanceState, Expense, Income, RecurringTransaction, BudgetRule, CreditCard } from '@/types/finance';
import { generateInstallments } from '@/lib/installments';
import { getCreditCardUsageForMonth } from '@/lib/creditCard';
import { financeService } from '@/lib/financeService';
import { userService } from '@/lib/userService';

const STORAGE_KEY = 'fintrack-data';

const defaultState: FinanceState = {
  income: 0,
  budgetRule: { essentials: 50, personal: 30, investments: 20 },
  expenses: [],
  incomes: [],
  recurringTransactions: [],
  creditCards: [],
  isOnboarded: false,
  selectedMonth: new Date(),
};

export function useFinance() {
  const [state, setState] = useState<FinanceState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const userId = userService.getUserId();

  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        let localData = defaultState;
        
        if (saved) {
          const parsed = JSON.parse(saved);
          localData = {
            ...parsed,
            expenses: parsed.expenses?.map((e: Expense) => ({
              ...e,
              date: new Date(e.date),
            })) || [],
            incomes: parsed.incomes?.map((i: Income) => ({
              ...i,
              date: new Date(i.date),
            })) || [],
            recurringTransactions: parsed.recurringTransactions || [],
            creditCards: parsed.creditCards || [],
            goals: parsed.goals || [],
            alerts: parsed.alerts || [],
            plannedPurchases: parsed.plannedPurchases || [],
            selectedMonth: new Date(),
          };
        }
        
        const syncedData = await financeService.syncData(userId, localData);
        setState(syncedData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(syncedData));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [userId]);

  const saveData = useCallback(async (newState: FinanceState) => {
    if (isLoading) return;
    try {
      setIsSyncing(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      await financeService.saveUserData(userId, newState);
    } catch (error) {
      console.error('Error saving to cloud:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [userId, isLoading]);

  useEffect(() => {
    saveData(state);
  }, [state, saveData]);

  const completeOnboarding = useCallback((income: number, budgetRule: BudgetRule) => {
    setState(prev => ({
      ...prev,
      income,
      budgetRule,
      isOnboarded: true,
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    const expenseDate = expense.date || new Date(state.selectedMonth.getFullYear(), state.selectedMonth.getMonth(), 1);
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      date: expenseDate,
      installments: expense.installments ? {
        ...expense.installments,
        originalAmount: expense.installments.originalAmount || expense.amount
      } : undefined
    };
    
    // Generate all installments if it's a credit card purchase with multiple installments
    const installments = generateInstallments(newExpense);
    
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, ...installments],
    }));
  }, [state.selectedMonth]);

  const addIncome = useCallback((income: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...income,
      id: crypto.randomUUID(),
      date: new Date(state.selectedMonth.getFullYear(), state.selectedMonth.getMonth(), income.date?.getDate() || 1),
    };
    setState(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome],
    }));
  }, [state.selectedMonth]);

  const removeIncome = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      incomes: prev.incomes.filter(i => i.id !== id),
    }));
  }, []);

  const addRecurringTransaction = useCallback((transaction: Omit<RecurringTransaction, 'id'>) => {
    const newTransaction: RecurringTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      recurringTransactions: [...prev.recurringTransactions, newTransaction],
    }));
  }, []);

  const toggleRecurringTransaction = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      recurringTransactions: prev.recurringTransactions.map(t => 
        t.id === id ? { ...t, isActive: !t.isActive } : t
      ),
    }));
  }, []);

  const removeRecurringTransaction = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      recurringTransactions: prev.recurringTransactions.filter(t => t.id !== id),
    }));
  }, []);

  const addCreditCard = useCallback((card: Omit<CreditCard, 'id'>) => {
    const newCard: CreditCard = {
      ...card,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      creditCards: [...prev.creditCards, newCard],
    }));
  }, []);

  const updateCreditCard = useCallback((id: string, updates: Partial<CreditCard>) => {
    setState(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(card => 
        card.id === id ? { ...card, ...updates } : card
      ),
    }));
  }, []);

  const removeCreditCard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      creditCards: prev.creditCards.filter(card => card.id !== id),
    }));
  }, []);

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    }));
  }, []);

  const addPlannedPurchase = useCallback((purchase: Omit<PlannedPurchase, 'id'>) => {
    const newPurchase: PlannedPurchase = {
      ...purchase,
      id: crypto.randomUUID(),
    };
    setState(prev => ({
      ...prev,
      plannedPurchases: [...prev.plannedPurchases, newPurchase],
    }));
  }, []);

  const setSelectedMonth = useCallback((month: Date) => {
    setState(prev => ({ ...prev, selectedMonth: month }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id),
    }));
  }, []);

  const updateIncome = useCallback((income: number) => {
    setState(prev => ({ ...prev, income }));
  }, []);

  const updateBudgetRule = useCallback((budgetRule: BudgetRule) => {
    setState(prev => ({ ...prev, budgetRule }));
  }, []);

  const updateCreditCardLimit = useCallback((id: string, limit: number) => {
    updateCreditCard(id, { limit });
  }, [updateCreditCard]);

  const resetData = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getCreditCardUsage = useCallback((cardId: string) => {
    const card = state.creditCards.find(c => c.id === cardId);
    if (!card) return { used: 0, available: 0, percent: 0 };
    
    const used = getCreditCardUsageForMonth(
      state.expenses.filter(e => e.creditCardId === cardId), 
      state.selectedMonth, 
      card.dueDay
    );
    const available = card.limit - used;
    const percent = card.limit > 0 ? (used / card.limit) * 100 : 0;
    
    return { used, available, percent };
  }, [state.expenses, state.creditCards, state.selectedMonth]);

  const getBankStatementExpenses = () => {
    const currentExpenses = state.expenses.filter(e => {
      return e.date.getMonth() === state.selectedMonth.getMonth() && 
             e.date.getFullYear() === state.selectedMonth.getFullYear();
    });
    return currentExpenses.filter(e => e.showInBankStatement);
  };

  // Computed values
  const currentMonthExpenses = state.expenses.filter(e => {
    return e.date.getMonth() === state.selectedMonth.getMonth() && 
           e.date.getFullYear() === state.selectedMonth.getFullYear();
  });

  const currentMonthIncomes = state.incomes.filter(i => {
    return i.date.getMonth() === state.selectedMonth.getMonth() && 
           i.date.getFullYear() === state.selectedMonth.getFullYear();
  });

  const additionalIncome = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  
  const activeRecurringExpenses = state.recurringTransactions
    .filter(t => t.isActive && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const activeRecurringIncomes = state.recurringTransactions
    .filter(t => t.isActive && t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMonthlyIncome = state.income + additionalIncome + activeRecurringIncomes;
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0) + activeRecurringExpenses;
  
  const essentialSpent = currentMonthExpenses
    .filter(e => e.type === 'essential')
    .reduce((sum, e) => sum + e.amount, 0) + activeRecurringExpenses;
  
  const personalSpent = currentMonthExpenses
    .filter(e => e.type === 'personal')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const investmentSpent = currentMonthExpenses
    .filter(e => e.type === 'investment')
    .reduce((sum, e) => sum + e.amount, 0);

  const essentialBudget = (totalMonthlyIncome * state.budgetRule.essentials) / 100;
  const personalBudget = (totalMonthlyIncome * state.budgetRule.personal) / 100;
  const investmentBudget = (totalMonthlyIncome * state.budgetRule.investments) / 100;

  const essentialRemaining = essentialBudget - essentialSpent;
  const personalRemaining = personalBudget - personalSpent;
  const investmentRemaining = investmentBudget - investmentSpent;

  const creditCardUsedThisMonth = (state.creditCards || []).reduce((total, card) => {
    return total + getCreditCardUsage(card.id).used;
  }, 0);
  const totalCreditLimit = (state.creditCards || []).reduce((total, card) => total + card.limit, 0);
  const creditCardAvailable = totalCreditLimit - creditCardUsedThisMonth;
  const creditCardUsagePercent = totalCreditLimit > 0 
    ? (creditCardUsedThisMonth / totalCreditLimit) * 100 
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
    isLoading,
    isSyncing,
    completeOnboarding,
    addExpense,
    removeExpense,
    addIncome,
    removeIncome,
    addRecurringTransaction,
    toggleRecurringTransaction,
    removeRecurringTransaction,
    setSelectedMonth,
    addCreditCard,
    updateCreditCard,
    removeCreditCard,
    getCreditCardUsage,
    getBankStatementExpenses,
    addGoal,
    updateGoal,
    addPlannedPurchase,
    updateIncome,
    updateBudgetRule,
    updateCreditCardLimit,
    resetData,
    currentMonthExpenses,
    currentMonthIncomes,
    totalMonthlyIncome,
    additionalIncome,
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
    creditCardLimit: totalCreditLimit,
    creditCardUsed: creditCardUsedThisMonth,
    creditCardAvailable,
    creditCardUsagePercent,
    overallHealth: overallHealth(),
  };
}
