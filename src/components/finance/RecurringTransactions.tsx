import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Repeat, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecurringTransaction } from '@/types/finance';

interface RecurringTransactionsProps {
  transactions: RecurringTransaction[];
  onAdd: (transaction: Omit<RecurringTransaction, 'id'>) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function RecurringTransactions({ transactions, onAdd, onToggle, onRemove }: RecurringTransactionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !description) return;

    onAdd({
      amount: parseFloat(amount),
      description,
      type,
      frequency: 'monthly',
      isActive: true,
    });

    setAmount('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Repeat className="w-5 h-5 mr-2" />
            Contas Recorrentes
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border rounded-lg p-4 space-y-4"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={type} onValueChange={(value: 'expense' | 'income') => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Gasto</SelectItem>
                      <SelectItem value="income">Renda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      R$
                    </span>
                    <Input
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
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  placeholder="Ex: Aluguel, Salário, Netflix"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Adicionar
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma conta recorrente cadastrada
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  transaction.isActive ? 'bg-background' : 'bg-muted/50'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${transaction.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {transaction.description}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type === 'income' ? 'Renda' : 'Gasto'}
                    </span>
                  </div>
                  <p className={`text-sm ${transaction.isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggle(transaction.id)}
                  >
                    {transaction.isActive ? (
                      <ToggleRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}