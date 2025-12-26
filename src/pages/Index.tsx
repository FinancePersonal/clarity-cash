import { useFinance } from '@/hooks/useFinance';
import { Onboarding } from '@/components/finance/Onboarding';
import { Header } from '@/components/finance/Header';
import { CanSpendMeter } from '@/components/finance/CanSpendMeter';
import { SummaryCard } from '@/components/finance/SummaryCard';
import { BudgetMeter } from '@/components/finance/BudgetMeter';
import { CreditCardStatus } from '@/components/finance/CreditCardStatus';
import { QuickExpenseForm } from '@/components/finance/QuickExpenseForm';
import { ExpenseList } from '@/components/finance/ExpenseList';
import { CategoryBreakdown } from '@/components/finance/CategoryBreakdown';
import { IncomeForm } from '@/components/finance/IncomeForm';
import { RecurringTransactions } from '@/components/finance/RecurringTransactions';
import { Alerts } from '@/components/finance/Alerts';
import { SyncStatus } from '@/components/ui/sync-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';

const Index = () => {
  const finance = useFinance();

  if (!finance.isOnboarded) {
    return <Onboarding onComplete={finance.completeOnboarding} />;
  }

  const availableToSpend = finance.totalMonthlyIncome - finance.totalSpent;
  const totalAvailableBudget = finance.totalMonthlyIncome;
  
  const getDaysLeftInMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return Math.max(1, lastDay.getDate() - today.getDate());
  };

  const daysLeft = getDaysLeftInMonth();

  return (
    <div className="min-h-screen bg-background">
      <SyncStatus isLoading={finance.isLoading} isSyncing={finance.isSyncing} />
      <Alerts 
        alerts={finance.alerts || []} 
        onDismiss={(id) => {
          // Mark alert as read
          const updatedAlerts = finance.alerts?.map(alert => 
            alert.id === id ? { ...alert, isRead: true } : alert
          ) || [];
          // This would need to be implemented in useFinance
        }}
      />
      <div className="container max-w-6xl mx-auto px-4 pb-24">
        <Header 
          selectedMonth={finance.selectedMonth}
          onMonthChange={finance.setSelectedMonth}
          onReset={finance.resetData} 
        />

        <main className="space-y-6">
          {/* Main Meter */}
          <CanSpendMeter
            totalRemaining={availableToSpend}
            totalBudget={totalAvailableBudget}
            health={finance.overallHealth}
            daysLeft={daysLeft}
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Renda Total"
              value={finance.totalMonthlyIncome}
              subtitle={finance.additionalIncome > 0 ? `+R$ ${finance.additionalIncome.toFixed(2)} extra` : undefined}
              icon={Wallet}
              delay={0}
            />
            <SummaryCard
              title="Total Gasto"
              value={finance.totalSpent}
              subtitle={`${((finance.totalSpent / finance.totalMonthlyIncome) * 100).toFixed(0)}% da renda`}
              icon={TrendingDown}
              variant={finance.totalSpent > finance.totalMonthlyIncome * 0.8 ? 'warning' : 'default'}
              delay={0.1}
            />
            <SummaryCard
              title="Investido"
              value={finance.investmentSpent}
              subtitle={`Sugerido: R$ ${finance.investmentBudget.toFixed(2)} (${finance.budgetRule.investments}%)`}
              icon={TrendingUp}
              variant="success"
              delay={0.2}
            />
            <SummaryCard
              title="Disponível"
              value={availableToSpend}
              subtitle={`Sobrou da renda total`}
              icon={PiggyBank}
              variant={availableToSpend < 0 ? 'danger' : 'default'}
              delay={0.3}
            />
          </div>

          {/* Income & Recurring Transactions */}
          <div className="grid lg:grid-cols-2 gap-6">
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

          {/* Budget Breakdown & Credit Card */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Orçamento do Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <BudgetMeter
                  spent={finance.essentialSpent}
                  budget={finance.essentialBudget}
                  label={`Essenciais (${finance.budgetRule.essentials}%)`}
                  size="lg"
                />
                <BudgetMeter
                  spent={finance.personalSpent}
                  budget={finance.personalBudget}
                  label={`Pessoais (${finance.budgetRule.personal}%)`}
                  size="lg"
                />
                <BudgetMeter
                  spent={finance.investmentSpent}
                  budget={finance.investmentBudget}
                  label={`Investimentos - Sugerido: R$ ${finance.investmentBudget.toFixed(2)} (${finance.budgetRule.investments}%)`}
                  size="lg"
                />
              </CardContent>
            </Card>

            {finance.creditCards.length > 0 && (
              <CreditCardStatus
                limit={finance.creditCardLimit}
                used={finance.creditCardUsed}
                dueDay={10}
                selectedMonth={finance.selectedMonth}
              />
            )}
          </div>

          {/* Expenses & Categories */}
          <div className="grid lg:grid-cols-2 gap-6">
            <ExpenseList
              expenses={finance.currentMonthExpenses}
              onDelete={finance.removeExpense}
            />
            <CategoryBreakdown expenses={finance.currentMonthExpenses} />
          </div>
        </main>

        {/* Quick Add Button */}
        <QuickExpenseForm 
          creditCards={finance.creditCards}
          selectedMonth={finance.selectedMonth}
          onSubmit={finance.addExpense} 
        />
      </div>
    </div>
  );
};

export default Index;
