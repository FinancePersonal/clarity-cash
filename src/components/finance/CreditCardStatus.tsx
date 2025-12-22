import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BudgetMeter } from './BudgetMeter';
import { CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreditCardStatusProps {
  limit: number;
  used: number;
}

export function CreditCardStatus({ limit, used }: CreditCardStatusProps) {
  const available = limit - used;
  const usagePercent = limit > 0 ? (used / limit) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatus = () => {
    if (usagePercent >= 90) return 'danger';
    if (usagePercent >= 70) return 'warning';
    return 'good';
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card variant={status === 'danger' ? 'danger' : status === 'warning' ? 'warning' : 'default'}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl",
              status === 'good' && "bg-primary/10",
              status === 'warning' && "bg-warning/20",
              status === 'danger' && "bg-danger/20"
            )}>
              <CreditCard className={cn(
                "w-5 h-5",
                status === 'good' && "text-primary",
                status === 'warning' && "text-warning",
                status === 'danger' && "text-danger"
              )} />
            </div>
            <CardTitle className="text-base">Cartão de Crédito</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Usado</p>
              <p className="text-lg font-bold">{formatCurrency(used)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Disponível</p>
              <p className={cn(
                "text-lg font-bold",
                status === 'good' && "text-success",
                status === 'warning' && "text-warning",
                status === 'danger' && "text-danger"
              )}>
                {formatCurrency(available)}
              </p>
            </div>
          </div>
          <BudgetMeter 
            spent={used} 
            budget={limit} 
            label="" 
            showAmount={false}
            size="sm"
          />
          {usagePercent >= 70 && (
            <p className={cn(
              "text-xs font-medium",
              status === 'warning' && "text-warning",
              status === 'danger' && "text-danger"
            )}>
              {status === 'danger' 
                ? '⚠️ Cartão quase no limite!' 
                : '⚡ Atenção com o uso do cartão'
              }
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
