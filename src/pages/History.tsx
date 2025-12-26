import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinance } from '@/hooks/useFinance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { categoryLabels, categoryIcons, ExpenseCategory } from '@/types/finance';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const History = () => {
  const finance = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const goToPreviousMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setSelectedMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setSelectedMonth(newMonth);
  };

  const currentMonth = new Intl.DateTimeFormat('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).format(selectedMonth);

  // Current month data
  const currentMonthExpenses = finance.expenses.filter(e => {
    return e.date.getMonth() === selectedMonth.getMonth() && 
           e.date.getFullYear() === selectedMonth.getFullYear();
  });

  const currentMonthIncomes = finance.incomes.filter(i => {
    return i.date.getMonth() === selectedMonth.getMonth() && 
           i.date.getFullYear() === selectedMonth.getFullYear();
  });

  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0) + 
    finance.recurringTransactions
      .filter(t => t.isActive && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = finance.income + 
    currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0) + 
    finance.recurringTransactions
      .filter(t => t.isActive && t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

  // Generate last 6 months data
  const monthlyData = useMemo(() => {
    const months: Array<{
      month: string;
      monthDate: Date;
      expenses: number;
      essentials: number;
      personal: number;
      investments: number;
      income: number;
    }> = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthExpenses = finance.expenses.filter(e => 
        e.date.getMonth() === date.getMonth() && 
        e.date.getFullYear() === date.getFullYear()
      );

      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      const essentials = monthExpenses
        .filter(e => e.type === 'essential')
        .reduce((sum, e) => sum + e.amount, 0);
      const personal = monthExpenses
        .filter(e => e.type === 'personal')
        .reduce((sum, e) => sum + e.amount, 0);
      const investments = monthExpenses
        .filter(e => e.type === 'investment')
        .reduce((sum, e) => sum + e.amount, 0);

      const monthIncomes = finance.incomes.filter(inc => 
        inc.date.getMonth() === date.getMonth() && 
        inc.date.getFullYear() === date.getFullYear()
      );
      const totalIncome = finance.income + monthIncomes.reduce((sum, i) => sum + i.amount, 0);

      months.push({
        month: new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date),
        monthDate: date,
        expenses: total,
        essentials,
        personal,
        investments,
        income: totalIncome,
      });
    }

    return months;
  }, [finance.expenses, finance.incomes, finance.income]);

  // Category breakdown for last 3 months
  const categoryTrends = useMemo(() => {
    const categories: Record<ExpenseCategory, number[]> = {
      housing: [],
      food: [],
      transport: [],
      health: [],
      education: [],
      entertainment: [],
      shopping: [],
      subscription: [],
      investment: [],
      other: [],
    };

    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      const monthExpenses = finance.expenses.filter(e => 
        e.date.getMonth() === date.getMonth() && 
        e.date.getFullYear() === date.getFullYear()
      );

      Object.keys(categories).forEach(cat => {
        const catExpenses = monthExpenses
          .filter(e => e.category === cat)
          .reduce((sum, e) => sum + e.amount, 0);
        categories[cat as ExpenseCategory].push(catExpenses);
      });
    }

    return Object.entries(categories)
      .map(([category, values]) => ({
        category: category as ExpenseCategory,
        values,
        total: values.reduce((a, b) => a + b, 0),
        trend: values[2] - values[1],
      }))
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [finance.expenses]);

  // Month-over-month comparison
  const comparison = useMemo(() => {
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];

    if (!currentMonth || !previousMonth) return null;

    const expenseChange = previousMonth.expenses > 0 
      ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100 
      : 0;

    return {
      current: currentMonth.expenses,
      previous: previousMonth.expenses,
      change: expenseChange,
      direction: expenseChange > 0 ? 'up' : expenseChange < 0 ? 'down' : 'neutral',
    };
  }, [monthlyData]);

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-danger" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-success" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  if (finance.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Histórico</h1>
              <p className="text-sm text-muted-foreground">Acompanhe seus gastos por mês</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-[180px] text-center">
              <span className="capitalize font-medium">{currentMonth}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Month Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Renda Total</p>
                <p className="text-xl font-bold">{formatCurrency(totalIncome)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">Total Gasto</p>
                <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">%</span>
                </div>
                <p className="text-sm text-muted-foreground">% da Renda</p>
                <p className="text-xl font-bold">{totalIncome > 0 ? ((totalSpent / totalIncome) * 100).toFixed(1) : 0}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">💰</span>
                </div>
                <p className="text-sm text-muted-foreground">Disponível</p>
                <p className="text-xl font-bold">{formatCurrency(totalIncome - totalSpent)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Evolution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Evolução dos Gastos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis 
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        className="text-xs fill-muted-foreground"
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))' }}
                        name="Total Gastos"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="income" 
                        stroke="hsl(var(--success))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: 'hsl(var(--success))' }}
                        name="Renda"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Expenses by Type Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs fill-muted-foreground"
                      />
                      <YAxis 
                        tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                        className="text-xs fill-muted-foreground"
                      />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="essentials" 
                        name="Essenciais" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="personal" 
                        name="Pessoais" 
                        fill="hsl(var(--warning))" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="investments" 
                        name="Investimentos" 
                        fill="hsl(var(--success))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tendência por Categoria</CardTitle>
                <p className="text-sm text-muted-foreground">Últimos 3 meses</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTrends.map((cat, index) => (
                    <motion.div
                      key={cat.category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryIcons[cat.category]}</span>
                        <div>
                          <p className="font-medium">{categoryLabels[cat.category]}</p>
                          <p className="text-xs text-muted-foreground">
                            Total: {formatCurrency(cat.total)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(cat.trend)}
                        <span className={`text-sm font-medium ${
                          cat.trend > 0 ? 'text-danger' : 
                          cat.trend < 0 ? 'text-success' : 
                          'text-muted-foreground'
                        }`}>
                          {cat.trend > 0 ? '+' : ''}{formatCurrency(cat.trend)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  {categoryTrends.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Sem dados suficientes para mostrar tendências
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Summary Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Mês</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Renda</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Gastos</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Saldo</th>
                        <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((month, index) => {
                        const balance = month.income - month.expenses;
                        const percentUsed = month.income > 0 
                          ? (month.expenses / month.income) * 100 
                          : 0;
                        
                        return (
                          <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-2 font-medium capitalize">{month.month}</td>
                            <td className="py-3 px-2 text-right text-muted-foreground">
                              {formatCurrency(month.income)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {formatCurrency(month.expenses)}
                            </td>
                            <td className={`py-3 px-2 text-right font-medium ${
                              balance >= 0 ? 'text-success' : 'text-danger'
                            }`}>
                              {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
                            </td>
                            <td className={`py-3 px-2 text-right text-sm ${
                              percentUsed > 100 ? 'text-danger' : 
                              percentUsed > 80 ? 'text-warning' : 
                              'text-success'
                            }`}>
                              {percentUsed.toFixed(0)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default History;
