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

  const statusConfig = {
    good: {
      barColor: 'bg-success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      dotColor: 'bg-success',
    },
    caution: {
      barColor: 'bg-warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      dotColor: 'bg-warning',
    },
    warning: {
      barColor: 'bg-warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      dotColor: 'bg-warning',
    },
    danger: {
      barColor: 'bg-danger',
      bgColor: 'bg-danger/10',
      textColor: 'text-danger',
      dotColor: 'bg-danger',
    },
  };

  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", config.dotColor)} />
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {showAmount && (
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-sm font-semibold tabular-nums",
              overBudget ? "text-danger" : "text-foreground"
            )}>
              {formatCurrency(spent)}
            </span>
            <span className="text-sm text-muted-foreground">
              de {formatCurrency(budget)}
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full tabular-nums",
              config.bgColor,
              config.textColor
            )}>
              {percentage.toFixed(0)}%
            </span>
          </div>
        )}
      </div>
      
      <div className={cn(
        "w-full rounded-full overflow-hidden bg-muted/50",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn("h-full rounded-full", config.barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium",
          overBudget ? "text-danger" : config.textColor
        )}>
          {overBudget 
            ? `Excedido em ${formatCurrency(Math.abs(remaining))}`
            : `Disponível: ${formatCurrency(remaining)}`
          }
        </span>
      </div>
    </div>
  );
}
