import { useFinance } from '@/hooks/useFinance';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { AnalyticsDashboard } from '@/components/finance/AnalyticsDashboard';
import { ExpenseTracker } from '@/components/finance/ExpenseTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  PieChart,
  Activity,
  FileText,
  Target
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const Reports = () => {
  const finance = useFinance();

  if (finance.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const categoryData = [
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
    const amount = finance.currentMonthExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: category,
      value: amount,
    };
  }).filter(item => item.value > 0);

  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    
    const monthExpenses = finance.expenses.filter(e => 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear()
    );
    
    return {
      month: date.toLocaleDateString('pt-BR', { month: 'short' }),
      gastos: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  });

  const typeData = [
    { name: 'Essenciais', value: finance.essentialSpent, color: '#ef4444' },
    { name: 'Pessoais', value: finance.personalSpent, color: '#f59e0b' },
    { name: 'Investimentos', value: finance.investmentSpent, color: '#10b981' },
  ].filter(item => item.value > 0);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const exportData = () => {
    const data = {
      mes: finance.selectedMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      renda: finance.totalMonthlyIncome,
      gastos: finance.totalSpent,
      categorias: categoryData,
      cartoes: finance.creditCards.map(card => ({
        nome: card.name,
        usado: finance.getCreditCardUsage(card.id).used,
        limite: card.limit,
      })),
      analise: {
        taxaPoupanca: ((finance.totalMonthlyIncome - finance.totalSpent) / finance.totalMonthlyIncome) * 100,
        gastoMedioDiario: finance.totalSpent / new Date(finance.selectedMonth.getFullYear(), finance.selectedMonth.getMonth() + 1, 0).getDate(),
        maiorCategoria: categoryData.length > 0 ? categoryData.reduce((prev, current) => prev.value > current.value ? prev : current) : null
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarity-cash-relatorio-${finance.selectedMonth.getMonth() + 1}-${finance.selectedMonth.getFullYear()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const savingsRate = ((finance.totalMonthlyIncome - finance.totalSpent) / finance.totalMonthlyIncome) * 100;
  const spentPercentage = (finance.totalSpent / finance.totalMonthlyIncome) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardHeader 
        selectedMonth={finance.selectedMonth}
        onMonthChange={finance.setSelectedMonth}
        onExportData={exportData}
        onRefresh={() => window.location.reload()}
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fintech-card bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <Badge className="status-positive">
                Receita
              </Badge>
            </div>
            <div>
              <p className="fintech-label mb-1">Renda Total</p>
              <p className="fintech-metric text-success">
                {formatCurrency(finance.totalMonthlyIncome)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card bg-gradient-to-br from-danger/5 to-danger/10 border-danger/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-danger/10">
                <TrendingDown className="h-6 w-6 text-danger" />
              </div>
              <Badge className="status-negative">
                {spentPercentage.toFixed(0)}% da renda
              </Badge>
            </div>
            <div>
              <p className="fintech-label mb-1">Total Gasto</p>
              <p className="fintech-metric text-danger">
                {formatCurrency(finance.totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary">
                Taxa
              </Badge>
            </div>
            <div>
              <p className="fintech-label mb-1">Taxa de Poupança</p>
              <p className="fintech-metric text-primary">
                {savingsRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-warning/10">
                <Activity className="h-6 w-6 text-warning" />
              </div>
              <Badge className="status-warning">
                Disponível
              </Badge>
            </div>
            <div>
              <p className="fintech-label mb-1">Saldo Restante</p>
              <p className="fintech-metric text-warning">
                {formatCurrency(finance.totalMonthlyIncome - finance.totalSpent)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Análises
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="expenses" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Despesas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {/* Financial Health Overview - Moved from top */}
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
                    className={cn(
                      'h-2',
                      savingsRate > 20 ? '[&>div]:bg-success' :
                      savingsRate > 10 ? '[&>div]:bg-warning' :
                      '[&>div]:bg-danger'
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    R$ {(finance.totalMonthlyIncome - finance.totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} poupados
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
                      {spentPercentage.toFixed(0)}%
                    </span>
                    <Badge variant="secondary">
                      da renda
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(spentPercentage, 100)} 
                    className={cn(
                      'h-2',
                      spentPercentage > 90 ? '[&>div]:bg-danger' :
                      spentPercentage > 70 ? '[&>div]:bg-warning' :
                      '[&>div]:bg-primary'
                    )}
                  />
                  <p className="text-sm text-muted-foreground">
                    R$ {finance.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gastos
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
                  {categoryData.length > 0 ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-foreground">
                          {((categoryData[0].value / finance.totalSpent) * 100).toFixed(0)}%
                        </span>
                        <Badge variant="secondary">
                          {categoryData[0].name}
                        </Badge>
                      </div>
                      <Progress 
                        value={(categoryData[0].value / finance.totalSpent) * 100} 
                        className="h-2 [&>div]:bg-warning"
                      />
                      <p className="text-sm text-muted-foreground">
                        R$ {categoryData[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum gasto registrado</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <AnalyticsDashboard 
            expenses={finance.currentMonthExpenses}
            totalIncome={finance.totalMonthlyIncome}
            selectedMonth={finance.selectedMonth}
          />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Gastos por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="fintech-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Por Tipo de Gasto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis tickFormatter={(value) => `R$ ${value}`} className="text-sm" />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Tendência dos Últimos 6 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-sm" />
                  <YAxis tickFormatter={(value) => `R$ ${value}`} className="text-sm" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpenseTracker 
            expenses={finance.currentMonthExpenses}
            onAddExpense={finance.addExpense}
            onDeleteExpense={finance.removeExpense}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;