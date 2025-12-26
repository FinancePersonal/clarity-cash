import { useFinance } from '@/hooks/useFinance';
import { SimpleGoals } from '@/components/finance/SimpleGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Target, Trophy, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Planning = () => {
  const finance = useFinance();

  const activeGoals = finance.goals?.filter(g => g.isActive) || [];
  const completedGoals = finance.goals?.filter(g => !g.isActive || g.currentAmount >= g.targetAmount) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Metas Financeiras</h1>
            <p className="text-muted-foreground">Defina e acompanhe suas metas de economia</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Resumo das Metas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{finance.goals?.length || 0}</p>
              </CardContent>
            </Card>
          </div>

          {/* Metas Simples */}
          <SimpleGoals
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