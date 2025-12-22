import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types/finance';

interface GoalsManagerProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
}

export function GoalsManager({ goals, onAdd, onUpdate }: GoalsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'savings' as Goal['category'],
    priority: 'medium' as Goal['priority'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.targetAmount || !formData.deadline) return;

    onAdd({
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: 0,
      deadline: new Date(formData.deadline),
      category: formData.category,
      priority: formData.priority,
      isActive: true,
    });

    setFormData({
      title: '',
      targetAmount: '',
      deadline: '',
      category: 'savings',
      priority: 'medium',
    });
    setIsAdding(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getDaysLeft = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const categoryLabels = {
    savings: 'Economia',
    purchase: 'Compra',
    investment: 'Investimento',
    debt: 'Quitação de Dívida',
  };

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Metas Financeiras
        </h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Nova Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título da Meta</Label>
                    <Input
                      placeholder="Ex: Viagem para Europa"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Alvo</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.targetAmount}
                      onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Prazo</Label>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select value={formData.category} onValueChange={(value: Goal['category']) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={formData.priority} onValueChange={(value: Goal['priority']) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Criar Meta
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4">
        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">Nenhuma meta definida</p>
              <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Meta
              </Button>
            </CardContent>
          </Card>
        ) : (
          goals.map(goal => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = getDaysLeft(goal.deadline);
            const isOverdue = daysLeft < 0;
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <div className={`h-1 ${priorityColors[goal.priority]}`} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryLabels[goal.category]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(goal.currentAmount)}</p>
                      <p className="text-sm text-muted-foreground">
                        de {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className={isOverdue ? 'text-red-500' : 'text-muted-foreground'}>
                        {isOverdue ? `${Math.abs(daysLeft)} dias atrasado` : `${daysLeft} dias restantes`}
                      </span>
                    </div>
                    {isOverdue && <AlertCircle className="w-4 h-4 text-red-500" />}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Input
                      type="number"
                      placeholder="Adicionar valor"
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const amount = parseFloat(input.value);
                          if (amount > 0) {
                            onUpdate(goal.id, {
                              currentAmount: goal.currentAmount + amount
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdate(goal.id, { isActive: !goal.isActive })}
                    >
                      {goal.isActive ? 'Pausar' : 'Ativar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}