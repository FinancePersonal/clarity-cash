import { motion } from 'framer-motion';
import { Expense, categoryLabels, categoryIcons } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { Trash2, CreditCard, Wallet, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  if (expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Receipt}
            title="Nenhum gasto registrado"
            description="Comece a controlar suas finanças adicionando seu primeiro gasto do mês"
            action={{
              label: 'Adicionar Gasto',
              onClick: () => document.querySelector('[data-testid="floating-action-button"]')?.click()
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Últimos Gastos</span>
          <span className="text-sm font-normal text-muted-foreground">
            {expenses.length} registros
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {sortedExpenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            <div className="text-2xl">
              {categoryIcons[expense.category]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">
                  {expense.description || categoryLabels[expense.category]}
                </p>
                {expense.installments && (
                  <StatusBadge variant="info">
                    {expense.installments.current}/{expense.installments.total}x
                  </StatusBadge>
                )}
                {expense.paymentMethod === 'credit' ? (
                  <CreditCard className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                ) : (
                  <Wallet className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(expense.date)} • {categoryLabels[expense.category]}
                {expense.installments && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    • Total: {formatCurrency(expense.installments.originalAmount)}
                  </span>
                )}
              </p>
            </div>
            <p className={cn(
              "font-semibold text-sm",
              expense.type === 'investment' ? 'text-success' : 'text-foreground'
            )}>
              {expense.type === 'investment' ? '+' : '-'}{formatCurrency(expense.amount)}
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              onClick={() => setExpenseToDelete(expense)}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-danger" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
      
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          if (expenseToDelete) {
            onDelete(expenseToDelete.id);
            setExpenseToDelete(null);
          }
        }}
        title={expenseToDelete?.installments ? 'Remover Parcelas' : 'Remover Gasto'}
        description={
          expenseToDelete?.installments 
            ? `Tem certeza que deseja remover todas as ${expenseToDelete.installments.total} parcelas desta compra? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja remover este gasto? Esta ação não pode ser desfeita.'
        }
        confirmText="Remover"
        variant="danger"
      />
    </Card>
  );
}
