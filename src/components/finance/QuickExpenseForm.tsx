import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, CreditCard, Wallet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExpenseCategory, categoryLabels, categoryIcons } from '@/types/finance';
import type { CreditCard } from '@/types/finance';

interface QuickExpenseFormProps {
  creditCards: CreditCard[];
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
  housing: 'personal',
  food: 'personal',
  transport: 'personal',
  health: 'personal',
  education: 'personal',
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
  const [firstInstallmentMonth, setFirstInstallmentMonth] = useState(() => {
    return `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`;
  });



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    if (paymentMethod === 'credit' && !creditCardId) {
      alert('Selecione um cartão de crédito');
      return;
    }

    const totalAmount = parseFloat(amount);
    const installmentCount = parseInt(installments);
    
    // Parse do mês da primeira parcela
    const [year, month] = firstInstallmentMonth.split('-').map(Number);
    const firstInstallmentDate = new Date(year, month - 1, 1);
    
    // Validação: não permitir parcelas muito no passado
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    if (paymentMethod === 'credit' && installmentCount > 1 && firstInstallmentDate < threeMonthsAgo) {
      alert('A primeira parcela não pode ser muito antiga. Selecione um mês mais recente.');
      return;
    }

    // Para compras parceladas, criar múltiplas despesas
    if (paymentMethod === 'credit' && installmentCount > 1) {
      const installmentAmount = totalAmount / installmentCount;
      
      for (let i = 0; i < installmentCount; i++) {
        const installmentDate = new Date(year, month - 1 + i, selectedMonth.getDate());
        
        onSubmit({
          amount: installmentAmount,
          category,
          description: `${description || categoryLabels[category]} (${i + 1}/${installmentCount})`,
          date: installmentDate,
          type: categoryTypeMap[category],
          paymentMethod,
          creditCardId,
          showInBankStatement,
          installments: {
            total: installmentCount,
            current: i + 1,
            originalAmount: totalAmount
          }
        });
      }
    } else {
      // Compra à vista ou parcela única
      onSubmit({
        amount: totalAmount,
        category,
        description: description || undefined,
        date: new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), selectedMonth.getDate()),
        type: categoryTypeMap[category],
        paymentMethod,
        creditCardId: paymentMethod === 'credit' ? creditCardId : undefined,
        showInBankStatement
      });
    }

    // Reset form
    setAmount('');
    setDescription('');
    setCreditCardId('');
    setShowInBankStatement(false);
    setInstallments('1');
    setFirstInstallmentMonth(`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`);
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
            className="absolute bottom-16 right-0 left-4 sm:left-auto sm:right-0 w-auto sm:w-80 md:w-96 max-h-[80vh] overflow-y-auto"
          >
            <Card className="shadow-2xl border-border/50 mx-auto">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Novo Gasto</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm z-10">
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
                        onClick={() => {
                          setPaymentMethod('cash');
                          setFirstInstallmentMonth(`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`);
                        }}
                        className="w-full text-xs sm:text-sm"
                        size="sm"
                      >
                        <Wallet className="w-3 h-3 mr-1" />
                        À vista
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                        onClick={() => {
                          setPaymentMethod('credit');
                          setFirstInstallmentMonth(`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`);
                        }}
                        className="w-full text-xs sm:text-sm"
                        size="sm"
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="installments">Número de Parcelas</Label>
                        <Input
                          id="installments"
                          type="number"
                          placeholder="1"
                          value={installments}
                          onChange={(e) => setInstallments(e.target.value)}
                          min="1"
                          max="24"
                        />
                      </div>
                      
                      {parseInt(installments) > 1 && (
                        <div className="space-y-2">
                          <Label htmlFor="first-installment-month">Mês da 1ª Parcela</Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="first-installment-month"
                              type="month"
                              value={firstInstallmentMonth}
                              onChange={(e) => setFirstInstallmentMonth(e.target.value)}
                              className="pl-10"
                              required
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Valor por parcela: R$ {(parseFloat(amount || '0') / parseInt(installments)).toFixed(2)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                      {categories.map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCategory(key)}
                          className={`flex flex-col items-center p-1.5 sm:p-2 rounded-xl text-xs transition-all ${
                            category === key
                              ? 'bg-primary/10 text-primary ring-2 ring-primary'
                              : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                          }`}
                          title={label}
                        >
                          <span className="text-base sm:text-lg mb-0.5 sm:mb-1">{categoryIcons[key]}</span>
                          <span className="truncate w-full text-center text-[9px] sm:text-[10px]">
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
