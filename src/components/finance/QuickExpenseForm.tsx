import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CreditCard, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExpenseCategory, categoryLabels, categoryIcons } from '@/types/finance';

interface QuickExpenseFormProps {
  creditCards: any[];
  selectedMonth: Date;
  onSubmit: (expense: {
    amount: number;
    category: ExpenseCategory;
    description?: string;
    date: Date;
    type: 'essential' | 'personal' | 'investment';
    paymentMethod: 'cash' | 'credit';
    creditCardId?: string;
    showInBankStatement?: boolean;
    installments?: {
      total: number;
      current: number;
      originalAmount: number;
    };
  }) => void;
}

const categoryTypeMap: Record<ExpenseCategory, 'essential' | 'personal' | 'investment'> = {
  housing: 'essential',
  food: 'essential',
  transport: 'essential',
  health: 'essential',
  education: 'essential',
  entertainment: 'personal',
  shopping: 'personal',
  subscription: 'personal',
  investment: 'investment',
  other: 'personal',
};

export function QuickExpenseForm({ creditCards, selectedMonth, onSubmit }: QuickExpenseFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [creditCardId, setCreditCardId] = useState('');
  const [showInBankStatement, setShowInBankStatement] = useState(false);
  const [installments, setInstallments] = useState('1');
  const [currentInstallment, setCurrentInstallment] = useState('1');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), today.getDate());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    const totalAmount = parseFloat(amount);
    const installmentCount = parseInt(installments);
    const installmentAmount = totalAmount / installmentCount;

    onSubmit({
      amount: totalAmount,
      category,
      description: description || undefined,
      date: selectedDate,
      type: categoryTypeMap[category],
      paymentMethod,
      creditCardId: paymentMethod === 'credit' ? creditCardId : undefined,
      showInBankStatement,
      installments: paymentMethod === 'credit' && installmentCount > 1 ? {
        total: installmentCount,
        current: parseInt(currentInstallment),
        originalAmount: totalAmount
      } : undefined,
    });

    // Reset form
    setAmount('');
    setDescription('');
    setCreditCardId('');
    setShowInBankStatement(false);
    setInstallments('1');
    setCurrentInstallment('1');
    setIsOpen(false);
  };

  const categories = Object.entries(categoryLabels) as [ExpenseCategory, string][];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-80 md:w-96"
          >
            <Card className="shadow-2xl border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Novo Gasto</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        R$
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0,00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 text-lg font-semibold"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label>Forma de pagamento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('cash')}
                        className="w-full"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        À vista
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('credit')}
                        className="w-full"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cartão
                      </Button>
                    </div>
                  </div>

                  {/* Credit Card Selection */}
                  {paymentMethod === 'credit' && creditCards.length > 0 && (
                    <div className="space-y-2">
                      <Label>Cartão</Label>
                      <select 
                        value={creditCardId} 
                        onChange={(e) => setCreditCardId(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Selecione o cartão</option>
                        {creditCards.map(card => (
                          <option key={card.id} value={card.id}>{card.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Bank Statement Option */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="bankStatement"
                      checked={showInBankStatement}
                      onChange={(e) => setShowInBankStatement(e.target.checked)}
                    />
                    <Label htmlFor="bankStatement" className="text-sm">
                      Mostrar no extrato bancário
                    </Label>
                  </div>

                  {/* Installments for Credit Card */}
                  {paymentMethod === 'credit' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="installments">Parcelas</Label>
                        <Input
                          id="installments"
                          type="number"
                          placeholder="1"
                          value={installments}
                          onChange={(e) => {
                            setInstallments(e.target.value);
                            if (parseInt(e.target.value) < parseInt(currentInstallment)) {
                              setCurrentInstallment(e.target.value);
                            }
                          }}
                          min="1"
                          max="24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="current-installment">Parcela Atual</Label>
                        <Input
                          id="current-installment"
                          type="number"
                          placeholder="1"
                          value={currentInstallment}
                          onChange={(e) => setCurrentInstallment(e.target.value)}
                          min="1"
                          max={installments}
                        />
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCategory(key)}
                          className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all ${
                            category === key
                              ? 'bg-primary/10 text-primary ring-2 ring-primary'
                              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                          }`}
                          title={label}
                        >
                          <span className="text-lg mb-1">{categoryIcons[key]}</span>
                          <span className="truncate w-full text-center text-[10px]">
                            {label.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Input
                      id="description"
                      placeholder="Ex: Almoço no restaurante"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Adicionar Gasto
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="xl"
          className="rounded-full shadow-xl w-14 h-14"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-6 h-6" />
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
