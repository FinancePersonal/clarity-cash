import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Calendar, DollarSign, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Goal } from '@/types/finance';

interface SmartGoalsManagerProps {
  goals: Goal[];
  onAdd: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
}

const goalCategories = [
  { id: 'financial', label: 'Financeira', icon: '💰', color: 'bg-green-100 text-green-800' },
  { id: 'career', label: 'Carreira', icon: '🚀', color: 'bg-blue-100 text-blue-800' },
  { id: 'health', label: 'Saúde', icon: '🏃', color: 'bg-red-100 text-red-800' },
  { id: 'fitness', label: 'Academia', icon: '💪', color: 'bg-orange-100 text-orange-800' },
  { id: 'weight', label: 'Peso Ideal', icon: '⚖️', color: 'bg-pink-100 text-pink-800' },
  { id: 'education', label: 'Educação', icon: '📚', color: 'bg-purple-100 text-purple-800' },
  { id: 'personal', label: 'Pessoal', icon: '🎯', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'travel', label: 'Viagem', icon: '✈️', color: 'bg-indigo-100 text-indigo-800' },
];

export function SmartGoalsManager({ goals, onAdd, onUpdate }: SmartGoalsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'financial',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    specificCriteria: '',
    measurableMetrics: '',
    achievableSteps: '',
    relevanceReason: '',
    timebound: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'financial',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      specificCriteria: '',
      measurableMetrics: '',
      achievableSteps: '',
      relevanceReason: '',
      timebound: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const goalData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      targetAmount: parseFloat(formData.targetAmount) || 0,
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: new Date(formData.deadline),
      isActive: true,
      smartCriteria: {
        specific: formData.specificCriteria,
        measurable: formData.measurableMetrics,
        achievable: formData.achievableSteps,
        relevant: formData.relevanceReason,
        timebound: formData.timebound,
      },
    };

    if (editingId) {
      onUpdate(editingId, goalData);
      setEditingId(null);
    } else {
      onAdd(goalData);
    }

    resetForm();
    setIsAdding(false);
  };

  const startEdit = (goal: Goal) => {
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category || 'financial',
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.toISOString().split('T')[0],
      specificCriteria: goal.smartCriteria?.specific || '',
      measurableMetrics: goal.smartCriteria?.measurable || '',
      achievableSteps: goal.smartCriteria?.achievable || '',
      relevanceReason: goal.smartCriteria?.relevant || '',
      timebound: goal.smartCriteria?.timebound || '',
    });
    setEditingId(goal.id);
    setIsAdding(true);
  };

  const getFormFields = () => {
    switch (formData.category) {
      case 'financial':
        return (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetAmount">Valor Alvo (R$)</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="50000"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="currentAmount">Valor Atual (R$)</Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="5000"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Prazo Final</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min="2025-01-01"
                max="2026-12-31"
                required
              />
            </div>
          </div>
        );
      
      case 'fitness':
        return (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetAmount">Dias por semana</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="5"
                min="1"
                max="7"
              />
            </div>
            <div>
              <Label htmlFor="currentAmount">Dias atuais</Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="2"
                min="0"
                max="7"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Prazo Final</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min="2025-01-01"
                max="2026-12-31"
                required
              />
            </div>
          </div>
        );
      
      case 'weight':
        return (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetAmount">Peso Alvo (kg)</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="70"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="currentAmount">Peso Atual (kg)</Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="80"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Prazo Final</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min="2025-01-01"
                max="2026-12-31"
                required
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="targetAmount">Meta Numérica</Label>
              <Input
                id="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="100"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="currentAmount">Progresso Atual</Label>
              <Input
                id="currentAmount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="10"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="deadline">Prazo Final</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                min="2025-01-01"
                max="2026-12-31"
                required
              />
            </div>
          </div>
        );
    }
  };

  const getProgressLabel = (goal: Goal) => {
    const categoryInfo = getCategoryInfo(goal.category || 'financial');
    switch (goal.category) {
      case 'financial':
        return `${formatCurrency(goal.currentAmount)} / ${formatCurrency(goal.targetAmount)}`;
      case 'fitness':
        return `${goal.currentAmount} / ${goal.targetAmount} dias por semana`;
      case 'weight':
        return `${goal.currentAmount}kg / ${goal.targetAmount}kg`;
      default:
        return `${goal.currentAmount} / ${goal.targetAmount}`;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCategoryInfo = (categoryId: string) => {
    return goalCategories.find(cat => cat.id === categoryId) || goalCategories[0];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Minhas Metas SMART 2026
            </CardTitle>
            <Button onClick={() => setIsAdding(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 border rounded-lg bg-muted/50"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título da Meta</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Comprar um carro novo"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Categoria</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        {goalCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva sua meta em detalhes..."
                    />
                  </div>

                  {getFormFields()}

                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-semibold text-sm">Critérios SMART</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="specific">Específica</Label>
                        <Textarea
                          id="specific"
                          value={formData.specificCriteria}
                          onChange={(e) => setFormData(prev => ({ ...prev, specificCriteria: e.target.value }))}
                          placeholder="O que exatamente você quer alcançar?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="measurable">Mensurável</Label>
                        <Textarea
                          id="measurable"
                          value={formData.measurableMetrics}
                          onChange={(e) => setFormData(prev => ({ ...prev, measurableMetrics: e.target.value }))}
                          placeholder="Como você vai medir o progresso?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="achievable">Atingível</Label>
                        <Textarea
                          id="achievable"
                          value={formData.achievableSteps}
                          onChange={(e) => setFormData(prev => ({ ...prev, achievableSteps: e.target.value }))}
                          placeholder="Quais passos você vai tomar?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="relevant">Relevante</Label>
                        <Textarea
                          id="relevant"
                          value={formData.relevanceReason}
                          onChange={(e) => setFormData(prev => ({ ...prev, relevanceReason: e.target.value }))}
                          placeholder="Por que essa meta é importante?"
                          rows={2}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="timebound">Temporal</Label>
                      <Textarea
                        id="timebound"
                        value={formData.timebound}
                        onChange={(e) => setFormData(prev => ({ ...prev, timebound: e.target.value }))}
                        placeholder="Qual o cronograma e marcos importantes?"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingId ? 'Atualizar Meta' : 'Criar Meta'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-4">
            {goals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma meta criada ainda.</p>
                <p className="text-sm">Comece definindo suas metas SMART para 2026!</p>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = getProgress(goal);
                const categoryInfo = getCategoryInfo(goal.category || 'financial');
                const isCompleted = progress >= 100;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            {categoryInfo.icon} {categoryInfo.label}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(goal)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <DollarSign className="w-3 h-3" />
                          Progresso Financeiro
                        </div>
                        <div className="font-medium">
                          {getProgressLabel(goal)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Calendar className="w-3 h-3" />
                          Prazo
                        </div>
                        <div className="font-medium">
                          {goal.deadline.toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">Progresso</div>
                        <div className="font-medium">{progress.toFixed(1)}%</div>
                      </div>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>

                    {goal.smartCriteria && (
                      <div className="grid md:grid-cols-2 gap-2 text-xs bg-muted/50 p-3 rounded">
                        {goal.smartCriteria.specific && (
                          <div>
                            <span className="font-medium text-blue-600">S:</span> {goal.smartCriteria.specific}
                          </div>
                        )}
                        {goal.smartCriteria.measurable && (
                          <div>
                            <span className="font-medium text-green-600">M:</span> {goal.smartCriteria.measurable}
                          </div>
                        )}
                        {goal.smartCriteria.achievable && (
                          <div>
                            <span className="font-medium text-yellow-600">A:</span> {goal.smartCriteria.achievable}
                          </div>
                        )}
                        {goal.smartCriteria.relevant && (
                          <div>
                            <span className="font-medium text-purple-600">R:</span> {goal.smartCriteria.relevant}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}