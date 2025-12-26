import { Expense } from '@/types/finance';

// Função simplificada - não gera mais parcelas automaticamente
// As parcelas são criadas individualmente no QuickExpenseForm
export function generateInstallments(expense: Expense): Expense[] {
  // Retorna apenas a despesa original, sem gerar parcelas adicionais
  return [expense];
}

export function shouldShowInstallment(expense: Expense, selectedMonth: Date): boolean {
  // Mostra a despesa se ela pertence ao mês selecionado
  return expense.date.getMonth() === selectedMonth.getMonth() && 
         expense.date.getFullYear() === selectedMonth.getFullYear();
}