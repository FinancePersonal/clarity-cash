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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingDown, TrendingUp, PiggyBank } from 'lucide-react';

const Index = () => {
  const finance = useFinance();

  if (!finance.isOnboarded) {
    return <Onboarding onComplete={finance.completeOnboarding} />;
  }

  const availableToSpend = finance.essentialRemaining + finance.personalRemaining;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 pb-24">
        <Header onReset={finance.resetData} />

        <main className="space-y-6">
          {/* Main Meter */}
          <CanSpendMeter
            totalRemaining={availableToSpend}
            totalBudget={finance.essentialBudget + finance.personalBudget}
            health={finance.overallHealth}
          />

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Renda"
              value={finance.income}
              icon={Wallet}
              delay={0}
            />
            <SummaryCard
              title="Total Gasto"
              value={finance.totalSpent}
              subtitle={`${((finance.totalSpent / finance.income) * 100).toFixed(0)}% da renda`}
              icon={TrendingDown}
              variant={finance.totalSpent > finance.income * 0.8 ? 'warning' : 'default'}
              delay={0.1}
            />
            <SummaryCard
              title="Investido"
              value={finance.investmentSpent}
              subtitle={`Meta: ${finance.budgetRule.investments}%`}
              icon={TrendingUp}
              variant="success"
              delay={0.2}
            />
            <SummaryCard
              title="Disponível"
              value={availableToSpend}
              icon={PiggyBank}
              variant={availableToSpend < 0 ? 'danger' : 'default'}
              delay={0.3}
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
                  label={`Investimentos (${finance.budgetRule.investments}%)`}
                  size="lg"
                />
              </CardContent>
            </Card>

            {finance.creditCardLimit > 0 && (
              <CreditCardStatus
                limit={finance.creditCardLimit}
                used={finance.creditCardUsed}
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
        <QuickExpenseForm onSubmit={finance.addExpense} />
      </div>
    </div>
  );
};

export default Index;
