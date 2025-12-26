import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CanSpendMeterProps {
  totalRemaining: number;
  totalBudget: number;
  health: 'excellent' | 'good' | 'warning' | 'danger';
  daysLeft?: number;
}

export function CanSpendMeter({ totalRemaining, totalBudget, health, daysLeft = 15 }: CanSpendMeterProps) {
  const percentage = totalBudget > 0 ? ((totalBudget - totalRemaining) / totalBudget) * 100 : 0;
  
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
      color: 'text-success',
      bg: 'bg-success',
      glow: 'shadow-[0_0_40px_hsl(var(--success)/0.3)]',
      message: 'Você está indo muito bem!',
      emoji: '🎉',
    },
    good: {
      color: 'text-success',
      bg: 'bg-success',
      glow: 'shadow-[0_0_30px_hsl(var(--success)/0.2)]',
      message: 'Tudo sob controle',
      emoji: '✨',
    },
    warning: {
      color: 'text-warning',
      bg: 'bg-warning',
      glow: 'shadow-[0_0_30px_hsl(var(--warning)/0.3)]',
      message: 'Atenção com os gastos',
      emoji: '⚠️',
    },
    danger: {
      color: 'text-danger',
      bg: 'bg-danger',
      glow: 'shadow-[0_0_30px_hsl(var(--danger)/0.3)]',
      message: 'Limite ultrapassado',
      emoji: '🚨',
    },
  };

  const config = healthConfig[health];
  const canSpend = totalRemaining > 0;
  const dailyBudget = canSpend ? totalRemaining / daysLeft : 0;
  
  const getInsight = () => {
    if (!canSpend) return 'Revise seus gastos para o próximo mês';
    if (dailyBudget > 100) return `Você pode gastar R$ ${dailyBudget.toFixed(0)} por dia`;
    if (dailyBudget > 50) return 'Gastos moderados pelos próximos dias';
    if (dailyBudget > 20) return 'Seja mais cauteloso com os gastos';
    return 'Evite gastos desnecessários';
  };

  return (
    <Card variant="primary" className={cn("relative overflow-hidden", config.glow)}>
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <motion.div 
              className="text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            >
              {config.emoji}
            </motion.div>
            
            <div className="space-y-1">
              <p className="text-primary-foreground/80 text-sm font-medium">
                {canSpend ? 'Você ainda pode gastar' : 'Você ultrapassou'}
              </p>
              <motion.p 
                className="text-4xl md:text-5xl font-bold text-primary-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {formatCurrency(Math.abs(totalRemaining))}
              </motion.p>
              <p className="text-primary-foreground/70 text-sm">
                {getInsight()}
              </p>
              {canSpend && daysLeft > 0 && (
                <div className="flex gap-4 pt-2 text-xs text-primary-foreground/60">
                  <span>📅 {daysLeft} dias restantes</span>
                  {dailyBudget > 0 && <span>💰 R$ {dailyBudget.toFixed(0)}/dia</span>}
                </div>
              )}
            </div>
          </div>

          {/* Circular progress indicator */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-primary-foreground/20"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-primary-foreground"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">
                  {(100 - percentage).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-xs mt-2">
              do orçamento disponível
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
