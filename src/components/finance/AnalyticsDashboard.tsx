import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Expense } from '@/types/finance';

interface AnalyticsDashboardProps {
  expenses: Expense[];
  totalIncome: number;
  selectedMonth: Date;
}

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  trend: number;
}

interface InsightData {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  value?: string;
}

export function AnalyticsDashboard({ expenses, totalIncome, selectedMonth }: AnalyticsDashboardProps) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const savingsRate = ((totalIncome - totalSpent) / totalIncome) * 100;
  
  // Category analysis
  const categoryData: CategoryData[] = [
    'Alimentação',
    'Transporte', 
    'Moradia',
    'Saúde',
    'Educação',
    'Entretenimento',
    'Compras',
    'Investimentos',
    'Outros'
  ].map(category => {
    const categoryExpenses = expenses.filter(e => e.category === category);
    const amount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    
    return {
      name: category,
      amount,
      percentage,
      color: getCategoryColor(category),
      trend: Math.random() * 20 - 10 // Mock trend data
    };
  }).filter(cat => cat.amount > 0).sort((a, b) => b.amount - a.amount);

  // Generate insights
  const insights: InsightData[] = [];
  
  if (savingsRate > 20) {
    insights.push({
      type: 'success',
      title: 'Excelente Taxa de Poupança',
      description: `Você está poupando ${savingsRate.toFixed(0)}% da sua renda. Continue assim!`,
      value: `${savingsRate.toFixed(0)}%`
    });
  } else if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      title: 'Taxa de Poupança Baixa',
      description: 'Considere revisar seus gastos para aumentar suas economias.',
      value: `${savingsRate.toFixed(0)}%`
    });
  }
  
  const topCategory = categoryData[0];
  if (topCategory && topCategory.percentage > 30) {
    insights.push({
      type: 'warning',
      title: 'Concentração de Gastos',
      description: `${topCategory.percentage.toFixed(0)}% dos seus gastos estão em ${topCategory.name}.`,
      value: `${topCategory.percentage.toFixed(0)}%`
    });
  }
  
  const dailyAverage = totalSpent / new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  insights.push({
    type: 'info',
    title: 'Gasto Médio Diário',
    description: 'Baseado nos gastos do mês atual.',
    value: `R$ ${dailyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  });

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Alimentação': '#f97316',
      'Transporte': '#3b82f6',
      'Moradia': '#10b981',
      'Saúde': '#ef4444',
      'Educação': '#8b5cf6',
      'Entretenimento': '#ec4899',
      'Compras': '#eab308',
      'Investimentos': '#6366f1',
      'Outros': '#6b7280'
    };
    return colors[category] || colors['Outros'];
  }

  const getInsightIcon = (type: InsightData['type']) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'danger': return AlertCircle;
      case 'info': return Clock;
    }
  };

  const getInsightColor = (type: InsightData['type']) => {
    switch (type) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'danger': return 'text-danger bg-danger/10 border-danger/20';
      case 'info': return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="fintech-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-success" />
              Taxa de Poupança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {savingsRate.toFixed(1)}%
                </span>
                <Badge className={cn(
                  savingsRate > 20 ? 'status-positive' :
                  savingsRate > 10 ? 'status-warning' :
                  'status-negative'
                )}>
                  {savingsRate > 20 ? 'Excelente' :
                   savingsRate > 10 ? 'Bom' : 'Baixo'}
                </Badge>
              </div>
              <Progress 
                value={Math.min(savingsRate, 100)} 
                className="h-2"
                indicatorClassName={cn(
                  savingsRate > 20 ? 'bg-success' :
                  savingsRate > 10 ? 'bg-warning' :
                  'bg-danger'
                )}
              />
              <p className="text-sm text-muted-foreground">
                R$ {(totalIncome - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} poupados
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Gasto vs Renda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {((totalSpent / totalIncome) * 100).toFixed(0)}%
                </span>
                <Badge variant="secondary">
                  da renda
                </Badge>
              </div>
              <Progress 
                value={Math.min((totalSpent / totalIncome) * 100, 100)} 
                className="h-2"
                indicatorClassName={cn(
                  (totalSpent / totalIncome) > 0.9 ? 'bg-danger' :
                  (totalSpent / totalIncome) > 0.7 ? 'bg-warning' :
                  'bg-primary'
                )}
              />
              <p className="text-sm text-muted-foreground">
                R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gastos
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-4 w-4 text-warning" />
              Maior Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCategory ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {topCategory.percentage.toFixed(0)}%
                    </span>
                    <Badge style={{ backgroundColor: `${topCategory.color}20`, color: topCategory.color, borderColor: `${topCategory.color}40` }}>
                      {topCategory.name}
                    </Badge>
                  </div>
                  <Progress 
                    value={topCategory.percentage} 
                    className="h-2"
                    style={{ 
                      '--progress-background': topCategory.color 
                    } as React.CSSProperties}
                  />
                  <p className="text-sm text-muted-foreground">
                    R$ {topCategory.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum gasto registrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-foreground">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {category.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-danger" />
                    )}
                  </div>
                </div>
                <Progress 
                  value={category.percentage} 
                  className="h-2"
                  style={{ 
                    '--progress-background': category.color 
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Insights Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={index} className={cn(
                  'p-4 rounded-xl border',
                  getInsightColor(insight.type)
                )}>
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        {insight.value && (
                          <Badge variant="secondary" className="text-xs">
                            {insight.value}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm opacity-90">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}