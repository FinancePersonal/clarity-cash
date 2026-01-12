import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Calendar, Wallet2 } from 'lucide-react';

interface CanSpendMeterProps {
  totalRemaining: number;
  totalBudget: number;
  health: 'excellent' | 'good' | 'warning' | 'danger';
  daysLeft?: number;
}

export function CanSpendMeter({ totalRemaining, totalBudget, health, daysLeft = 15 }: CanSpendMeterProps) {
  const percentage = totalBudget > 0 ? Math.min(((totalBudget - totalRemaining) / totalBudget) * 100, 100) : 0;
  const remainingPercentage = Math.max(100 - percentage, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const healthConfig = {
    excellent: {
      gradient: 'from-success via-success to-emerald-400',
      glow: 'shadow-glow-success',
      message: 'Excelente! Você está no controle.',
      icon: ArrowUpRight,
      iconColor: 'text-success',
      bgAccent: 'bg-success/5',
    },
    good: {
      gradient: 'from-success via-success to-emerald-400',
      glow: 'shadow-glow-success',
      message: 'Tudo sob controle este mês.',
      icon: ArrowUpRight,
      iconColor: 'text-success',
      bgAccent: 'bg-success/5',
    },
    warning: {
      gradient: 'from-warning via-amber-500 to-orange-400',
      glow: 'shadow-[0_0_40px_hsl(var(--warning)/0.2)]',
      message: 'Atenção com os próximos gastos.',
      icon: ArrowDownRight,
      iconColor: 'text-warning',
      bgAccent: 'bg-warning/5',
    },
    danger: {
      gradient: 'from-danger via-red-500 to-rose-400',
      glow: 'shadow-[0_0_40px_hsl(var(--danger)/0.2)]',
      message: 'Orçamento ultrapassado.',
      icon: ArrowDownRight,
      iconColor: 'text-danger',
      bgAccent: 'bg-danger/5',
    },
  };

  const config = healthConfig[health];
  const canSpend = totalRemaining > 0;
  const dailyBudget = canSpend && daysLeft > 0 ? totalRemaining / daysLeft : 0;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card",
        config.glow
      )}
    >
      {/* Background gradient accent */}
      <div className={cn("absolute inset-0 opacity-50", config.bgAccent)} />
      
      {/* Top gradient bar */}
      <div className={cn("h-1.5 bg-gradient-to-r", config.gradient)} />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Main content */}
          <div className="flex-1 space-y-6">
            {/* Status badge */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                canSpend ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              )}>
                <StatusIcon className="w-4 h-4" />
                {canSpend ? 'Saldo Positivo' : 'Saldo Negativo'}
              </div>
            </div>
            
            {/* Main value */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                {canSpend ? 'Disponível para gastar' : 'Valor excedido'}
              </p>
              <motion.p 
                className={cn(
                  "text-5xl lg:text-6xl font-bold tracking-tight value-display",
                  canSpend ? "text-foreground" : "text-danger"
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {formatCurrency(Math.abs(totalRemaining))}
              </motion.p>
              <p className="text-sm text-muted-foreground">
                {config.message}
              </p>
            </div>

            {/* Quick stats */}
            {canSpend && (
              <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{daysLeft} dias restantes</span>
                </div>
                {dailyBudget > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {formatCurrency(dailyBudget)}/dia
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Progress ring */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/50"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className={cn(
                    "transition-colors duration-500",
                    health === 'excellent' || health === 'good' ? "stroke-success" :
                    health === 'warning' ? "stroke-warning" : "stroke-danger"
                  )}
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - remainingPercentage / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">
                  {remainingPercentage.toFixed(0)}%
                </span>
                <span className="text-xs text-muted-foreground">disponível</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span>Gasto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  health === 'excellent' || health === 'good' ? "bg-success" :
                  health === 'warning' ? "bg-warning" : "bg-danger"
                )} />
                <span>Restante</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
