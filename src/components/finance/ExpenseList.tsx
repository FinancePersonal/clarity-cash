import { motion } from 'framer-motion';
import { Expense, categoryLabels, categoryIcons } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, CreditCard, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
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
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum gasto registrado este mês
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Use o botão + para adicionar seu primeiro gasto
          </p>
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
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {expense.installments.current}/{expense.installments.total}x
                  </span>
                )}
                {expense.paymentMethod === 'credit' ? (
                  <CreditCard className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                ) : (
                  <Wallet className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(expense.date)} • {categoryLabels[expense.category]}
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
              onClick={() => onDelete(expense.id)}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-danger" />
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
