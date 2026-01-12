import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  delay?: number;
  className?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  trendValue,
  variant = 'default',
  delay = 0,
  className 
}: SummaryCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-warning',
    },
    danger: {
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
      valueColor: 'text-danger',
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300",
        "hover:border-border hover:shadow-finance-lg hover:-translate-y-0.5",
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          
          <div className="space-y-1">
            <p className={cn(
              "text-3xl font-bold tracking-tight value-display",
              style.valueColor
            )}>
              {formatCurrency(value)}
            </p>
            
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {trend && trendValue && (
            <div className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
              trend === 'up' && "bg-danger/10 text-danger",
              trend === 'down' && "bg-success/10 text-success",
              trend === 'neutral' && "bg-muted text-muted-foreground"
            )}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
          style.iconBg
        )}>
          <Icon className={cn("w-5 h-5", style.iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}
