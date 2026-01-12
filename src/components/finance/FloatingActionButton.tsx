import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { investmentCategoryLabels, investmentCategoryIcons, type InvestmentCategory } from '@/types/finance';

interface FloatingActionButtonProps {
  onAddExpense: (expense: any) => void;
  onAddIncome?: (income: any) => void;
  onAddInvestment?: (investment: any) => void;
  className?: string;
}

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Compras',
  'Outros'
];

const investmentCategories: InvestmentCategory[] = [
  'fixed_income',
  'stocks', 
  'real_estate_funds',
  'crypto',
  'other_investments'
];

const paymentMethods = [
  { value: 'debit', label: 'Cartão de Débito', icon: CreditCard },
  { value: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'cash', label: 'Dinheiro', icon: Wallet },
  { value: 'pix', label: 'PIX', icon: Wallet }
];

// Map categories to correct expense types
const getCategoryType = (category: string): 'essential' | 'personal' => {
  const essentialCategories = ['Moradia', 'Saúde', 'Alimentação', 'Transporte'];
  
  if (essentialCategories.includes(category)) return 'essential';
  return 'personal';
};

export function FloatingActionButton({ 
  onAddExpense, 
  onAddIncome,
  onAddInvestment, 
  className 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'investment'>('expense');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    paymentMethod: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    if (activeTab === 'expense') {
      const category = formData.category || 'Outros';
      const expenseType = getCategoryType(category);
      
      onAddExpense({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: category,
        paymentMethod: formData.paymentMethod || 'cash',
        type: expenseType,
        date: new Date(),
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      });
    } else if (activeTab === 'income' && onAddIncome) {
      onAddIncome({
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(),
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      });
    } else if (activeTab === 'investment' && onAddInvestment) {
      onAddInvestment({
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category as InvestmentCategory,
        date: new Date(),
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      });
    }

    setFormData({
      description: '',
      amount: '',
      category: '',
      paymentMethod: ''
    });
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            data-testid="floating-action-button"
            className={cn(
              'fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 gradient-primary text-white z-50 hover:scale-110',
              className
            )}
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeTab === 'expense' ? (
                <>
                  <TrendingDown className="h-5 w-5 text-danger" />
                  Nova Despesa
                </>
              ) : activeTab === 'income' ? (
                <>
                  <TrendingUp className="h-5 w-5 text-success" />
                  Nova Receita
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Novo Investimento
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {/* Tab Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('expense')}
              className="flex-1"
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Despesa
            </Button>
            {onAddIncome && (
              <Button
                variant={activeTab === 'income' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('income')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Receita
              </Button>
            )}
            {onAddInvestment && (
              <Button
                variant={activeTab === 'investment' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('investment')}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Investir
              </Button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={
                  activeTab === 'expense' ? 'Ex: Almoço no restaurante' : 
                  activeTab === 'income' ? 'Ex: Salário' :
                  'Ex: Tesouro Direto IPCA+'
                }
                required
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>
            
            {(activeTab === 'expense' || activeTab === 'investment') && (
              <>
                <div>
                  <Label htmlFor="category">
                    {activeTab === 'expense' ? 'Categoria' : 'Categoria do Investimento'}
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTab === 'expense' ? (
                        categories.map(category => {
                          const type = getCategoryType(category);
                          const typeLabel = type === 'essential' ? ' (Essencial)' : ' (Pessoal)';
                          return (
                            <SelectItem key={category} value={category}>
                              {category}{typeLabel}
                            </SelectItem>
                          );
                        })
                      ) : (
                        investmentCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <span>{investmentCategoryIcons[category]}</span>
                              {investmentCategoryLabels[category]}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {activeTab === 'expense' && (
                  <div>
                    <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar forma" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(method => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex items-center gap-2">
                              <method.icon className="h-4 w-4" />
                              {method.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button 
                type="submit" 
                className={cn(
                  'flex-1 fintech-button',
                  activeTab === 'expense' 
                    ? 'bg-danger hover:bg-danger/90 text-white' 
                    : activeTab === 'income'
                    ? 'bg-success hover:bg-success/90 text-white'
                    : 'bg-primary hover:bg-primary/90 text-white'
                )}
              >
                {activeTab === 'expense' ? 'Adicionar Despesa' : 
                 activeTab === 'income' ? 'Adicionar Receita' :
                 'Adicionar Investimento'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="fintech-button"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}