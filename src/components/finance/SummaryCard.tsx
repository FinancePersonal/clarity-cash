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
      borderHover: 'hover:border-primary/30',
      glowHover: 'hover:shadow-[0_0_30px_hsl(var(--primary)/0.08)]',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success',
      borderHover: 'hover:border-success/30',
      glowHover: 'hover:shadow-[0_0_30px_hsl(var(--success)/0.1)]',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-warning',
      borderHover: 'hover:border-warning/30',
      glowHover: 'hover:shadow-[0_0_30px_hsl(var(--warning)/0.1)]',
    },
    danger: {
      iconBg: 'bg-danger/10',
      iconColor: 'text-danger',
      valueColor: 'text-danger',
      borderHover: 'hover:border-danger/30',
      glowHover: 'hover:shadow-[0_0_30px_hsl(var(--danger)/0.1)]',
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300",
        style.borderHover,
        style.glowHover,
        className
      )}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Top accent line */}
      <div className={cn(
        "absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
        variant === 'success' && "bg-success/50",
        variant === 'warning' && "bg-warning/50",
        variant === 'danger' && "bg-danger/50",
        variant === 'default' && "bg-primary/50"
      )} />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          
          <div className="space-y-1.5">
            <motion.p 
              className={cn(
                "text-3xl font-bold tracking-tight value-display",
                style.valueColor
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.1, duration: 0.3 }}
            >
              {formatCurrency(value)}
            </motion.p>
            
            {subtitle && (
              <p className="text-xs text-muted-foreground leading-relaxed">{subtitle}</p>
            )}
          </div>
          
          {trend && trendValue && (
            <motion.div 
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                trend === 'up' && "bg-danger/10 text-danger",
                trend === 'down' && "bg-success/10 text-success",
                trend === 'neutral' && "bg-muted text-muted-foreground"
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trendValue}
            </motion.div>
          )}
        </div>
        
        {/* Animated icon container */}
        <motion.div 
          className={cn(
            "p-3 rounded-xl transition-all duration-300",
            style.iconBg
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className={cn("w-5 h-5", style.iconColor)} />
        </motion.div>
      </div>
    </motion.div>
  );
}
