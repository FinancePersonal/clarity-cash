import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3,
  Target,
  Calendar,
  DollarSign
} from 'lucide-react';
import { InvestmentTracker } from '@/components/finance/InvestmentTracker';
import { FloatingActionButton } from '@/components/finance/FloatingActionButton';
import { useFinance } from '@/hooks/useFinance';
import { investmentCategoryLabels, investmentCategoryIcons, type InvestmentCategory } from '@/types/finance';

export default function InvestmentsPage() {
  const { 
    currentMonthInvestments,
    investments = [],
    investmentSpent,
    investmentBudget,
    investmentRemaining,
    totalMonthlyIncome,
    addInvestment,
    removeInvestment,
    selectedMonth
  } = useFinance();

  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const investmentPercentage = totalMonthlyIncome > 0 ? (investmentSpent / totalMonthlyIncome) * 100 : 0;
  
  // Análise por categoria
  const categoryAnalysis = Object.keys(investmentCategoryLabels).map(cat => {
    const category = cat as InvestmentCategory;
    const categoryInvestments = investments.filter(inv => inv.category === category);
    const total = categoryInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const percentage = totalInvestments > 0 ? (total / totalInvestments) * 100 : 0;
    
    return {
      category,
      total,
      percentage,
      count: categoryInvestments.length,
      label: investmentCategoryLabels[category]
    };
  }).filter(item => item.total > 0);

  // Evolução mensal (últimos 6 meses)
  const monthlyEvolution = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    
    const monthInvestments = investments.filter(inv => 
      inv.date.getMonth() === date.getMonth() && 
      inv.date.getFullYear() === date.getFullYear()
    );
    
    const total = monthInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      total,
      count: monthInvestments.length
    };
  }).reverse();

  const getHealthColor = () => {
    if (investmentPercentage >= 20) return 'text-success';
    if (investmentPercentage >= 10) return 'text-warning';
    return 'text-danger';
  };

  const getHealthStatus = () => {
    if (investmentPercentage >= 20) return 'Excelente';
    if (investmentPercentage >= 15) return 'Muito Bom';
    if (investmentPercentage >= 10) return 'Bom';
    if (investmentPercentage >= 5) return 'Regular';
    return 'Precisa Melhorar';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investimentos</h1>
          <p className="text-muted-foreground mt-1">
            Construa seu patrimônio de forma inteligente
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label">Total Investido</p>
                <p className="text-2xl font-bold text-success">
                  R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label">Este Mês</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {investmentSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label">% da Renda</p>
                <p className={`text-2xl font-bold ${getHealthColor()}`}>
                  {investmentPercentage.toFixed(1)}%
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label">Status</p>
                <p className={`text-lg font-semibold ${getHealthColor()}`}>
                  {getHealthStatus()}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise por Categoria */}
      {categoryAnalysis.length > 0 && (
        <Card className="fintech-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Distribuição por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categoryAnalysis.map(({ category, total, percentage, count, label }) => (
                <div key={category} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="text-sm text-muted-foreground">
                        {count} investimento{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evolução Mensal */}
      <Card className="fintech-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Evolução dos Últimos 6 Meses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {monthlyEvolution.map(({ month, total, count }) => (
              <div key={month} className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground mb-2">{month}</p>
                <p className="text-lg font-bold text-foreground">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {count} investimento{count !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dicas e Insights */}
      <Card className="fintech-card border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Insights Inteligentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {investmentPercentage < 10 && (
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-warning-foreground">
                <strong>Oportunidade:</strong> Você está investindo apenas {investmentPercentage.toFixed(1)}% da sua renda. 
                Considere aumentar para pelo menos 10-20% para acelerar a construção do seu patrimônio.
              </p>
            </div>
          )}
          
          {categoryAnalysis.length === 1 && (
            <div className="p-3 rounded-lg bg-info/10 border border-info/20">
              <p className="text-sm text-info-foreground">
                <strong>Diversificação:</strong> Você está concentrado em apenas uma categoria de investimento. 
                Considere diversificar entre renda fixa, ações e outros ativos.
              </p>
            </div>
          )}
          
          {investmentPercentage >= 20 && (
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-success-foreground">
                <strong>Parabéns!</strong> Você está investindo {investmentPercentage.toFixed(1)}% da sua renda. 
                Continue assim para construir um patrimônio sólido!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Tracker */}
      <InvestmentTracker
        investments={currentMonthInvestments}
        onAddInvestment={addInvestment}
        onDeleteInvestment={removeInvestment}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onAddExpense={() => {}}
        onAddInvestment={addInvestment}
      />
    </div>
  );
}