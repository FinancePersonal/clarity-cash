import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Target, Trash2 } from 'lucide-react';
import type { Goal } from '@/types/finance';

interface SimpleGoalsProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
}

export function SimpleGoals({ goals, onAdd, onUpdate }: SimpleGoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !deadline) return;

    onAdd({
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
      deadline: new Date(deadline),
      isActive: true,
      priority: 'medium'
    });

    setTitle('');
    setTargetAmount('');
    setDeadline('');
    setIsAdding(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getProgress = (goal: Goal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Metas Financeiras</CardTitle>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label htmlFor="title">Nome da Meta</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Reserva de emergência"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Valor Alvo</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Criar Meta</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAdding(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma meta criada ainda</p>
            <p className="text-sm">Clique em "Nova Meta" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUpdate(goal.id, { isActive: false })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso: {formatCurrency(goal.currentAmount)}</span>
                    <span>Meta: {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${getProgress(goal)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{getProgress(goal).toFixed(0)}% concluído</span>
                    <span>Prazo: {formatDate(goal.deadline)}</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Input
                      type="number"
                      placeholder="Adicionar valor"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const value = parseFloat(input.value);
                          if (value > 0) {
                            onUpdate(goal.id, {
                              currentAmount: goal.currentAmount + value
                            });
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={(e) => {
                        const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                        const value = parseFloat(input.value);
                        if (value > 0) {
                          onUpdate(goal.id, {
                            currentAmount: goal.currentAmount + value
                          });
                          input.value = '';
                        }
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}