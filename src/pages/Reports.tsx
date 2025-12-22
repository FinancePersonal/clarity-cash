import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { categoryLabels, categoryIcons } from '@/types/finance';

const Reports = () => {
  const finance = useFinance();

  const categoryData = Object.entries(categoryLabels).map(([key, label]) => {
    const amount = finance.currentMonthExpenses
      .filter(e => e.category === key)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: label,
      value: amount,
      icon: categoryIcons[key as keyof typeof categoryIcons],
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${finance.selectedMonth.getMonth() + 1}-${finance.selectedMonth.getFullYear()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Relatórios</h1>
          </div>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Resumo */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Renda Total</p>
                <p className="text-xl font-bold">{formatCurrency(finance.totalMonthlyIncome)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-xl font-bold">{formatCurrency(finance.totalSpent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">%</span>
                </div>
                <p className="text-sm text-muted-foreground">% da Renda</p>
                <p className="text-xl font-bold">{((finance.totalSpent / finance.totalMonthlyIncome) * 100).toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">💰</span>
                </div>
                <p className="text-sm text-muted-foreground">Disponível</p>
                <p className="text-xl font-bold">{formatCurrency(finance.essentialRemaining + finance.personalRemaining)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
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
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Por Tipo de Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Tendência Mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Tendência dos Últimos 6 Meses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="gastos" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;