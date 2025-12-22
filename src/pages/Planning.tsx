import { useFinance } from '@/hooks/useFinance';
import { GoalsManager } from '@/components/finance/GoalsManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calculator, ShoppingCart, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Planning = () => {
  const finance = useFinance();

  const calculateMonthlyGoalContribution = () => {
    const activeGoals = finance.goals?.filter(g => g.isActive) || [];
    return activeGoals.reduce((total, goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const daysLeft = Math.max(1, Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
      const monthsLeft = Math.max(1, daysLeft / 30);
      return total + (remaining / monthsLeft);
    }, 0);
  };

  const monthlyGoalContribution = calculateMonthlyGoalContribution();
  const availableForGoals = finance.essentialRemaining + finance.personalRemaining;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Planejamento Financeiro</h1>
        </div>

        <div className="grid gap-6">
          {/* Resumo do Planejamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Disponível para Metas</p>
                <p className="text-xl font-bold">{formatCurrency(availableForGoals)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Necessário p/ Metas</p>
                <p className="text-xl font-bold">{formatCurrency(monthlyGoalContribution)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm text-muted-foreground">Sobra Livre</p>
                <p className="text-xl font-bold">
                  {formatCurrency(Math.max(0, availableForGoals - monthlyGoalContribution))}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Simulador de Investimento */}
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Valor Mensal</label>
                    <p className="text-2xl font-bold">{formatCurrency(finance.investmentBudget)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Projeções (12 meses):</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Poupança (0.5% a.m.):</span>
                        <span className="font-medium">
                          {formatCurrency(finance.investmentBudget * 12 * 1.062)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>CDI (1% a.m.):</span>
                        <span className="font-medium">
                          {formatCurrency(finance.investmentBudget * 12 * 1.127)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Renda Variável (1.5% a.m.):</span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(finance.investmentBudget * 12 * 1.196)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Dicas de Investimento:</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Reserve 6 meses de gastos na poupança</p>
                      <p>• Diversifique entre renda fixa e variável</p>
                      <p>• Invista regularmente (dollar cost averaging)</p>
                      <p>• Considere fundos de índice para iniciantes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gerenciador de Metas */}
          <GoalsManager
            goals={finance.goals || []}
            onAdd={finance.addGoal}
            onUpdate={finance.updateGoal}
          />
        </div>
      </div>
    </div>
  );
};

export default Planning;