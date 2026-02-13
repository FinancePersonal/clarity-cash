import { MetricCard } from './MetricCard';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from '@/components/ui/circular-progress';
import { cn } from '@/lib/utils';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  PiggyBank,
  Target,
  CreditCard,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface FinancialOverviewProps {
  totalIncome: number;
  totalSpent: number;
  availableToSpend: number;
  investmentSpent: number;
  investmentBudget: number;
  creditCardUsed: number;
  creditCardLimit: number;
  budgetHealth: 'excellent' | 'good' | 'warning' | 'danger';
  daysLeftInMonth: number;
}

export function FinancialOverview({
  totalIncome,
  totalSpent,
  availableToSpend,
  investmentSpent,
  investmentBudget,
  creditCardUsed,
  creditCardLimit,
  budgetHealth,
  daysLeftInMonth
}: FinancialOverviewProps) {
  const spentPercentage = (totalSpent / totalIncome) * 100;
  const creditUsagePercentage = (creditCardUsed / creditCardLimit) * 100;
  const dailyBudget = availableToSpend / Math.max(daysLeftInMonth, 1);
  
  const getHealthColor = () => {
    switch (budgetHealth) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'danger': return 'text-danger';
    }
  };

  const getHealthMessage = () => {
    switch (budgetHealth) {
      case 'excellent': return 'Excelente controle financeiro';
      case 'good': return 'Boa gestão dos gastos';
      case 'warning': return 'Atenção aos gastos';
      case 'danger': return 'Orçamento comprometido';
    }
  };

  const getHealthIcon = () => {
    switch (budgetHealth) {
      case 'excellent':
      case 'good':
        return CheckCircle2;
      default:
        return AlertTriangle;
    }
  };

  const HealthIcon = getHealthIcon();

  return (
    <div className="space-y-8">
      {/* Enhanced Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Renda Total"
          value={totalIncome}
          subtitle="Renda mensal disponível"
          icon={Wallet}
          variant="success"
          tooltip="Soma da sua renda fixa mensal + receitas extras + receitas recorrentes ativas"
          className="fade-in"
        />
        
        <MetricCard
          title="Total Gasto"
          value={totalSpent}
          subtitle={`${spentPercentage.toFixed(0)}% da renda utilizada`}
          icon={TrendingDown}
          variant="danger"
          tooltip="Total de gastos essenciais e pessoais do mês (não inclui investimentos)"
          className="fade-in"
        />
        
        <MetricCard
          title="Investimentos"
          value={investmentSpent}
          subtitle={`Meta: R$ ${investmentBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          variant="warning"
          tooltip="Valor investido este mês. Meta baseada na regra de orçamento configurada"
          className="fade-in"
        >
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="fintech-label">Progresso da Meta</span>
              <span className="font-medium">{((investmentSpent / investmentBudget) * 100).toFixed(0)}%</span>
            </div>
            <Progress 
              value={Math.min((investmentSpent / investmentBudget) * 100, 100)} 
              className="h-2"
            />
          </div>
        </MetricCard>
        
        <MetricCard
          title="Disponível"
          value={availableToSpend}
          subtitle={availableToSpend < 0 ? 'Orçamento excedido' : 'Saldo restante'}
          icon={PiggyBank}
          variant="default"
          tooltip="Saldo disponível após descontar gastos e investimentos da renda total"
          className={cn('fade-in', availableToSpend < 0 && 'pulse-glow')}
        />
      </div>

      {/* Financial Health Indicator */}
      <div className="fintech-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CircularProgress
              value={spentPercentage}
              max={100}
              size="lg"
              variant={
                spentPercentage > 90 ? 'danger' :
                spentPercentage > 75 ? 'warning' :
                spentPercentage > 50 ? 'primary' : 'success'
              }
            />
            <div>
              <p className="fintech-label">Status Financeiro</p>
              <p className={cn('font-semibold text-lg', getHealthColor())}>
                {getHealthMessage()}
              </p>
            </div>
          </div>
          {daysLeftInMonth > 0 && (
            <div className="text-right">
              <p className="fintech-label">Orçamento Diário</p>
              <p className="text-lg font-bold text-primary">
                R$ {dailyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {daysLeftInMonth} dias restantes
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Credit Card Usage */}
      {creditCardLimit > 0 && (
        <div className="fintech-card p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Cartão de Crédito</h3>
                <p className="fintech-label">Utilização do limite disponível</p>
              </div>
            </div>
            {creditUsagePercentage > 80 && (
              <div className="flex items-center gap-2 text-warning animate-pulse">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Alto uso do limite</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="fintech-label">Utilizado</span>
              <span className="font-medium">
                R$ {creditCardUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {creditCardLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Progress 
              value={Math.min(creditUsagePercentage, 100)} 
              className="h-3"
            />
            <div className="flex justify-between text-sm">
              <span className={cn(
                'font-medium transition-colors duration-300',
                creditUsagePercentage > 80 ? 'text-danger' :
                creditUsagePercentage > 60 ? 'text-warning' :
                'text-success'
              )}>
                {creditUsagePercentage.toFixed(0)}% utilizado
              </span>
              <span className="fintech-label">
                R$ {(creditCardLimit - creditCardUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} disponível
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}