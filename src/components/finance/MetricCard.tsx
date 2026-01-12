import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  children
}: MetricCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-gradient-to-br from-success/5 to-success/10';
      case 'warning':
        return 'border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10';
      case 'danger':
        return 'border-danger/20 bg-gradient-to-br from-danger/5 to-danger/10';
      default:
        return 'border-border/50 bg-gradient-to-br from-card to-card/50';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'danger':
        return 'text-danger bg-danger/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className={cn(
      'fintech-card p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group',
      getVariantStyles(),
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="fintech-label mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="fintech-metric">
              {formatCurrency(value)}
            </span>
            {trend && (
              <span className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-success' : 'text-danger'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className={cn(
          'p-3 rounded-xl transition-all duration-300 group-hover:scale-110',
          getIconStyles()
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {children}
    </div>
  );
}