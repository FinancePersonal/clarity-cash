import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BudgetMeterProps {
  spent: number;
  budget: number;
  label: string;
  showAmount?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BudgetMeter({ spent, budget, label, showAmount = true, size = 'md' }: BudgetMeterProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const overBudget = spent > budget;
  const remaining = budget - spent;
  
  const getStatus = () => {
    if (overBudget) return 'danger';
    if (percentage >= 90) return 'warning';
    if (percentage >= 70) return 'caution';
    return 'good';
  };

  const status = getStatus();

  const statusColors = {
    good: 'bg-success',
    caution: 'bg-warning',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  const statusBgColors = {
    good: 'bg-success/20',
    caution: 'bg-warning/20',
    warning: 'bg-warning/20',
    danger: 'bg-danger/20',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {showAmount && (
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-semibold",
              overBudget ? "text-danger" : "text-muted-foreground"
            )}>
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      <div className={cn(
        "w-full rounded-full overflow-hidden",
        statusBgColors[status],
        sizeClasses[size]
      )}>
        <motion.div
          className={cn("h-full rounded-full", statusColors[status])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          "font-medium",
          overBudget ? "text-danger" : status === 'warning' ? "text-warning" : "text-success"
        )}>
          {overBudget 
            ? `Estourou ${formatCurrency(Math.abs(remaining))}`
            : `Disponível: ${formatCurrency(remaining)}`
          }
        </span>
      </div>
    </div>
  );
}
