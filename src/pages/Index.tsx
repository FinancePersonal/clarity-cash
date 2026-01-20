import { useFinance } from '@/hooks/useFinance';
import { Onboarding } from '@/components/finance/Onboarding';
import { DashboardHeader } from '@/components/finance/DashboardHeader';
import { FinancialOverview } from '@/components/finance/FinancialOverview';
import { FloatingActionButton } from '@/components/finance/FloatingActionButton';
import { ExpenseList } from '@/components/finance/ExpenseList';
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown';
import { IncomeForm } from '@/components/finance/IncomeForm';
import { RecurringTransactions } from '@/components/finance/RecurringTransactions';
import { Alerts } from '@/components/finance/Alerts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';

const Index = () => {
  const finance = useFinance();

  if (!finance.isOnboarded) {
    return (
      <div className="max-w-2xl mx-auto">
        <Onboarding onComplete={finance.completeOnboarding} />
      </div>
    );
  }

  const availableToSpend = finance.totalMonthlyIncome - finance.totalSpent - finance.investmentSpent;
  const totalAvailableBudget = finance.totalMonthlyIncome;
  
  const getDaysLeftInMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return Math.max(1, lastDay.getDate() - today.getDate());
  };

  const daysLeft = getDaysLeftInMonth();
  
  const getBudgetHealth = (): 'excellent' | 'good' | 'warning' | 'danger' => {
    const spentPercentage = (finance.totalSpent / finance.totalMonthlyIncome) * 100;
    if (spentPercentage <= 50) return 'excellent';
    if (spentPercentage <= 75) return 'good';
    if (spentPercentage <= 90) return 'warning';
    return 'danger';
  };

  const getSmartMessage = () => {
    const spentPercentage = (finance.totalSpent / finance.totalMonthlyIncome) * 100;
    const totalUsed = finance.totalSpent + finance.investmentSpent;
    const dailyBudget = (finance.totalMonthlyIncome - totalUsed) / Math.max(daysLeft, 1);
    
    if (totalUsed > finance.totalMonthlyIncome) {
      return {
        title: 'Orçamento excedido',
        subtitle: 'Considere revisar seus gastos este mês',
        action: 'Ver onde economizar'
      };
    }
    if (spentPercentage > 80) {
      return {
        title: 'Atenção ao ritmo',
        subtitle: `Limite diário: R$ ${dailyBudget.toFixed(0)} pelos próximos ${daysLeft} dias`,
        action: 'Ajustar gastos'
      };
    }
    if (spentPercentage < 40) {
      return {
        title: 'Excelente controle!',
        subtitle: 'Você pode investir mais ou criar uma reserva',
        action: 'Ver oportunidades'
      };
    }
    return {
      title: 'Boa gestão financeira',
      subtitle: `R$ ${dailyBudget.toFixed(0)}/dia disponível pelos próximos ${daysLeft} dias`,
      action: 'Continuar assim'
    };
  };

  const smartMessage = getSmartMessage();

  const exportData = () => {
    const data = {
      month: finance.selectedMonth,
      income: finance.totalMonthlyIncome,
      expenses: finance.currentMonthExpenses,
      summary: {
        totalSpent: finance.totalSpent,
        availableToSpend,
        budgetHealth: getBudgetHealth()
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clarity-cash-${finance.selectedMonth.getFullYear()}-${finance.selectedMonth.getMonth() + 1}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Alerts */}
      <Alerts 
        alerts={finance.alerts || []} 
        onDismiss={(id) => {
          const updatedAlerts = finance.alerts?.map(alert => 
            alert.id === id ? { ...alert, isRead: true } : alert
          ) || [];
        }}
      />
      
      {/* Dashboard Header */}
      <DashboardHeader 
        selectedMonth={finance.selectedMonth}
        onMonthChange={finance.setSelectedMonth}
        onExportData={exportData}
        onRefresh={finance.resetData}
      />

      {/*/!* Smart Financial Insight Banner *!/*/}
      {/*<div className="fintech-card p-3 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 border-primary/20 mb-4">*/}
      {/*  <div className="flex items-center justify-between">*/}
      {/*    <div className="flex items-center gap-2">*/}
      {/*      <Sparkles className="h-4 w-4 text-primary" />*/}
      {/*      <div>*/}
      {/*        <h3 className="text-sm font-medium text-foreground">{smartMessage.title}</h3>*/}
      {/*        <p className="text-xs text-muted-foreground">{smartMessage.subtitle}</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <Button variant="outline" size="sm" className="fintech-button text-xs" onClick={() => window.location.href = '/reports'}>*/}
      {/*      {smartMessage.action}*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*/!* Compact Financial Overview *!/*/}
      {/*<div className="fintech-card p-4 mb-6">*/}
      {/*  <div className="flex items-center justify-between">*/}
      {/*    <div>*/}
      {/*      <h2 className="text-lg font-semibold text-foreground">Visão Geral</h2>*/}
      {/*      <p className="text-sm text-muted-foreground">{finance.overallHealth === 'excellent' ? 'Excelente controle' : finance.overallHealth === 'good' ? 'Bom controle' : finance.overallHealth === 'warning' ? 'Atenção' : 'Crítico'}</p>*/}
      {/*    </div>*/}
      {/*    <div className="text-right">*/}
      {/*      <p className="text-sm text-muted-foreground">Orçamento Utilizado</p>*/}
      {/*      <p className="text-2xl font-bold text-foreground">{((finance.totalSpent / finance.totalMonthlyIncome) * 100).toFixed(0)}%</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* Financial Overview */}
      <div className="mb-6">
        <FinancialOverview
          totalIncome={finance.totalMonthlyIncome}
          totalSpent={finance.totalSpent}
          availableToSpend={availableToSpend}
          investmentSpent={finance.investmentSpent}
          investmentBudget={finance.investmentBudget}
          creditCardUsed={finance.creditCardUsed}
          creditCardLimit={finance.creditCardLimit}
          budgetHealth={getBudgetHealth()}
          daysLeftInMonth={daysLeft}
        />
      </div>

      {/* Enhanced Quick Actions with CTA Hierarchy */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="fintech-card lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Ações Rápidas
              </CardTitle>
              <Badge variant="secondary" className="bg-primary/10 text-primary animate-pulse">
                {finance.currentMonthExpenses.length} transações
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Primary CTA - Nova Despesa */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">Registrar Gasto</h4>
                  <p className="text-sm text-muted-foreground">Ação mais comum</p>
                </div>
                <Button 
                  onClick={() => document.querySelector('[data-testid="floating-action-button"]')?.click()}
                  className="gradient-primary text-white hover:scale-105 transition-transform duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </div>
            </div>
            
            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => document.querySelector('[data-testid="floating-action-button"]')?.click()}
                variant="outline" 
                className="fintech-button h-12 hover:scale-105 transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
              <Button 
                onClick={() => window.location.href = '/app/reports'}
                variant="outline" 
                className="fintech-button h-12 hover:scale-105 transition-all duration-200"
              >
                <Activity className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">Receitas</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  R$ {finance.totalMonthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 hover:bg-danger/10 transition-colors duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDownRight className="h-4 w-4 text-danger" />
                  <span className="text-sm font-medium text-danger">Despesas</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  R$ {finance.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {finance.currentMonthExpenses.slice(0, 3).map((expense, index) => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <div>
                    <p className="font-medium text-sm text-foreground">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.category}</p>
                  </div>
                  <p className="font-semibold text-sm text-danger">
                    -R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
              
              {finance.currentMonthExpenses.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">Nenhuma transação ainda</p>
                  <p className="text-xs text-muted-foreground mt-1">Comece registrando uma despesa</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income & Recurring Transactions */}
      <div className="grid lg:grid-cols-2 gap-8">
        <IncomeForm 
          incomes={finance.currentMonthIncomes}
          selectedMonth={finance.selectedMonth}
          onSubmit={finance.addIncome}
          onRemove={finance.removeIncome}
        />
        <RecurringTransactions
          transactions={finance.recurringTransactions}
          onAdd={finance.addRecurringTransaction}
          onToggle={finance.toggleRecurringTransaction}
          onRemove={finance.removeRecurringTransaction}
        />
      </div>

      {/* Expenses & Categories */}
      <div className="grid lg:grid-cols-2 gap-8">
        <ExpenseList
          expenses={finance.currentMonthExpenses}
          onDelete={finance.removeExpense}
        />
        <CategoryBreakdown expenses={finance.currentMonthExpenses} />
      </div>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton 
        onAddExpense={finance.addExpense}
        onAddIncome={finance.addIncome}
        onAddInvestment={finance.addInvestment}
        creditCards={finance.creditCards}
        className="shadow-2xl hover:shadow-primary/25"
      />
    </div>
  );
};

export default Index;
