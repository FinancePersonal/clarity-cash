import { Expense } from '@/types/finance';

export function getBillMonth(purchaseDate: Date, dueDay: number): Date {
  const billMonth = new Date(purchaseDate);
  
  // Se a compra foi feita após o dia de vencimento, a fatura é do mês seguinte
  if (purchaseDate.getDate() > dueDay) {
    billMonth.setMonth(billMonth.getMonth() + 1);
  }
  
  return billMonth;
}

export function getCreditCardUsageForMonth(expenses: Expense[], month: Date, dueDay: number): number {
  return expenses
    .filter(expense => {
      if (expense.paymentMethod !== 'credit') return false;
      
      const billMonth = getBillMonth(expense.date, dueDay);
      return billMonth.getMonth() === month.getMonth() && 
             billMonth.getFullYear() === month.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
}