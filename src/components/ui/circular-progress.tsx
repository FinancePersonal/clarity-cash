import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'success' | 'warning' | 'danger' | 'primary';
  showLabel?: boolean;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: { circle: 40, stroke: 4, text: 'text-xs' },
    md: { circle: 60, stroke: 6, text: 'text-sm' },
    lg: { circle: 80, stroke: 8, text: 'text-base' },
  };
  
  const colors = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    primary: 'text-primary',
  };

  const { circle, stroke, text } = sizes[size];
  const radius = (circle - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={circle} height={circle} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500 ease-out', colors[variant])}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-semibold', text, colors[variant])}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
