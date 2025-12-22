import { motion } from 'framer-motion';
import { Expense, ExpenseCategory, categoryLabels, categoryIcons } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CategoryBreakdownProps {
  expenses: Expense[];
}

export function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate totals by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (sortedCategories.length === 0) {
    return null;
  }

  const maxAmount = Math.max(...sortedCategories.map(([, amount]) => amount));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedCategories.map(([category, amount], index) => {
          const percent = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
          const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category as ExpenseCategory]}</span>
                  <span className="text-sm font-medium">{categoryLabels[category as ExpenseCategory]}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">{formatCurrency(amount)}</span>
                  <span className="text-xs text-muted-foreground ml-2">({percent.toFixed(0)}%)</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
