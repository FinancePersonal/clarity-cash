import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, DollarSign, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Income } from '@/types/finance';

interface IncomeFormProps {
  incomes: Income[];
  selectedMonth: Date;
  onSubmit: (income: {
    amount: number;
    description?: string;
    date: Date;
  }) => void;
  onRemove: (id: string) => void;
}

export function IncomeForm({ incomes, selectedMonth, onSubmit, onRemove }: IncomeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), today.getDate());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    onSubmit({
      amount: parseFloat(amount),
      description: description || undefined,
      date: selectedDate,
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Renda
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Nova Renda
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="income-amount">Valor</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      R$
                    </span>
                    <Input
                      id="income-amount"
                      type="number"
                      placeholder="0,00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-description">Descrição</Label>
                  <Input
                    id="income-description"
                    placeholder="Ex: Freelance, Venda, Bônus"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income-date">Data</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="income-date"
                      type="date"
                      value={formatDateForInput(selectedDate)}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="pl-10"
                      min={formatDateForInput(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1))}
                      max={formatDateForInput(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0))}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Adicionar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {incomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rendas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {incomes.map((income) => (
                <div key={income.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border">
                  <div>
                    <span className="font-medium text-green-700">{income.description}</span>
                    <p className="text-sm text-green-600">
                      R$ {income.amount.toFixed(2)} • {new Date(income.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(income.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}