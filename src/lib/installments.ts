import { Expense } from '@/types/finance';

export function generateInstallments(expense: Expense): Expense[] {
  if (!expense.installments || expense.installments.total <= 1) {
    return [expense];
  }

  const installments: Expense[] = [];
  const { total, originalAmount, current = 1 } = expense.installments;
  const installmentAmount = originalAmount / total;

  for (let i = current; i <= total; i++) {
    const installmentDate = new Date(expense.date);
    installmentDate.setMonth(installmentDate.getMonth() + (i - current));

    installments.push({
      ...expense,
      id: i === current ? expense.id : `${expense.id}-${i}`,
      amount: installmentAmount,
      date: installmentDate,
      description: `${expense.description || ''} (${i}/${total})`.trim(),
      installments: {
        total,
        current: i,
        originalAmount,
      },
    });
  }

  return installments;
}

export function shouldShowInstallment(expense: Expense, selectedMonth: Date): boolean {
  if (!expense.installments) return true;
  
  return expense.date.getMonth() === selectedMonth.getMonth() && 
         expense.date.getFullYear() === selectedMonth.getFullYear();
}