import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: LucideIcon;
  pulse?: boolean;
  className?: string;
}

export function StatusBadge({ variant, children, icon: Icon, pulse, className }: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'danger':
        return 'bg-danger/10 text-danger border-danger/20';
      case 'info':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'neutral':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300',
        getVariantStyles(),
        pulse && 'animate-pulse',
        className
      )}
    >
      {Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}

interface ProgressBadgeProps {
  current: number;
  total: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function ProgressBadge({ current, total, variant = 'default' }: ProgressBadgeProps) {
  const percentage = (current / total) * 100;
  
  const getVariant = (): 'success' | 'warning' | 'danger' | 'info' => {
    if (variant !== 'default') return variant;
    if (percentage >= 100) return 'success';
    if (percentage >= 75) return 'warning';
    if (percentage >= 50) return 'info';
    return 'danger';
  };

  return (
    <StatusBadge variant={getVariant()}>
      {current}/{total} ({percentage.toFixed(0)}%)
    </StatusBadge>
  );
}
