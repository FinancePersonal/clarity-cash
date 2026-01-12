import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Calendar, Wallet2, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

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

  // Smart microcopy based on financial health
  const healthConfig = {
    excellent: {
      gradient: 'from-success via-emerald-500 to-teal-400',
      glow: 'shadow-glow-success',
      message: 'Excelente controle financeiro! Continue assim. 💚',
      shortMessage: 'Excelente!',
      icon: Sparkles,
      iconColor: 'text-success',
      bgAccent: 'bg-success/5',
      borderColor: 'border-success/20',
    },
    good: {
      gradient: 'from-success via-emerald-500 to-teal-400',
      glow: 'shadow-glow-success',
      message: 'Tudo sob controle. Você está no caminho certo. ✨',
      shortMessage: 'Sob controle',
      icon: CheckCircle2,
      iconColor: 'text-success',
      bgAccent: 'bg-success/5',
      borderColor: 'border-success/20',
    },
    warning: {
      gradient: 'from-warning via-amber-500 to-orange-400',
      glow: 'shadow-[0_0_40px_hsl(var(--warning)/0.15)]',
      message: 'Atenção ao ritmo de gastos. Revise suas prioridades. ⚠️',
      shortMessage: 'Atenção',
      icon: AlertTriangle,
      iconColor: 'text-warning',
      bgAccent: 'bg-warning/5',
      borderColor: 'border-warning/20',
    },
    danger: {
      gradient: 'from-danger via-red-500 to-rose-400',
      glow: 'shadow-[0_0_40px_hsl(var(--danger)/0.15)]',
      message: 'Orçamento excedido. Hora de ajustar os gastos. ❌',
      shortMessage: 'Excedido',
      icon: ArrowDownRight,
      iconColor: 'text-danger',
      bgAccent: 'bg-danger/5',
      borderColor: 'border-danger/20',
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card",
        config.borderColor,
        config.glow
      )}
    >
      {/* Background gradient accent */}
      <div className={cn("absolute inset-0 opacity-60", config.bgAccent)} />
      
      {/* Top gradient bar with animation */}
      <motion.div 
        className={cn("h-1 bg-gradient-to-r", config.gradient)}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ originX: 0 }}
      />
      
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Main content */}
          <div className="flex-1 space-y-6">
            {/* Status badge with pulse animation */}
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border",
                canSpend 
                  ? "bg-success/10 text-success border-success/20" 
                  : "bg-danger/10 text-danger border-danger/20"
              )}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <StatusIcon className="w-4 h-4" />
                </motion.div>
                {canSpend ? 'Saldo Positivo' : 'Saldo Negativo'}
              </div>
            </motion.div>
            
            {/* Main value with staggered animation */}
            <div className="space-y-3">
              <motion.p 
                className="text-sm font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {canSpend ? 'Disponível para gastar' : 'Valor excedido'}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <p className={cn(
                  "text-5xl lg:text-6xl font-bold tracking-tight value-display",
                  canSpend ? "text-foreground" : "text-danger"
                )}>
                  {formatCurrency(Math.abs(totalRemaining))}
                </p>
              </motion.div>
              
              {/* Smart contextual message */}
              <motion.p 
                className={cn(
                  "text-sm font-medium inline-flex items-center gap-2 px-3 py-1.5 rounded-lg",
                  config.bgAccent
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className={config.iconColor}>{config.message}</span>
              </motion.p>
            </div>

            {/* Quick stats with hover effects */}
            {canSpend && (
              <motion.div 
                className="flex flex-wrap gap-4 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-default"
                  whileHover={{ scale: 1.02 }}
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{daysLeft}</span> dias restantes
                  </span>
                </motion.div>
                {dailyBudget > 0 && (
                  <motion.div 
                    className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-default"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Wallet2 className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold text-foreground">{formatCurrency(dailyBudget)}</span>/dia
                    </span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right: Animated Progress ring */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-44 h-44">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-muted/30"
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={cn(
                    "transition-colors duration-500",
                    health === 'excellent' || health === 'good' ? "stroke-success" :
                    health === 'warning' ? "stroke-warning" : "stroke-danger"
                  )}
                  strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - remainingPercentage / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-4xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                >
                  {remainingPercentage.toFixed(0)}%
                </motion.span>
                <span className="text-xs text-muted-foreground font-medium">disponível</span>
              </div>
            </div>
            
            {/* Legend with subtle animation */}
            <motion.div 
              className="flex items-center gap-6 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <span className="font-medium">Gasto</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.div 
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    health === 'excellent' || health === 'good' ? "bg-success" :
                    health === 'warning' ? "bg-warning" : "bg-danger"
                  )}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-medium">Restante</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
