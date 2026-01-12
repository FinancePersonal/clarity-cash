import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CreditCard,
  Wallet,
  Tag,
  Trash2,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Expense } from '@/types/finance';

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
  onEditExpense?: (id: string, expense: Partial<Expense>) => void;
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

// Map categories to correct expense types
const getCategoryType = (category: string): 'essential' | 'personal' => {
  const essentialCategories = ['Moradia', 'Saúde', 'Alimentação', 'Transporte'];
  
  if (essentialCategories.includes(category)) return 'essential';
  return 'personal';
};

const paymentMethods = [
  { value: 'debit', label: 'Cartão de Débito', icon: CreditCard },
  { value: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'cash', label: 'Dinheiro', icon: Wallet },
  { value: 'pix', label: 'PIX', icon: Wallet }
];

export function ExpenseTracker({ 
  expenses, 
  onAddExpense, 
  onDeleteExpense, 
  onEditExpense 
}: ExpenseTrackerProps) {
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    paymentMethod: '',
    type: 'personal' as const
  });

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.category) return;

    const category = newExpense.category;
    const expenseType = getCategoryType(category);

    onAddExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: category,
      paymentMethod: newExpense.paymentMethod,
      type: expenseType, // Correctly determine type based on category
      date: new Date(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });

    setNewExpense({
      description: '',
      amount: '',
      category: '',
      paymentMethod: '',
      type: 'personal'
    });
    setIsAddingExpense(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Alimentação': 'bg-orange-100 text-orange-800 border-orange-200',
      'Transporte': 'bg-blue-100 text-blue-800 border-blue-200',
      'Moradia': 'bg-green-100 text-green-800 border-green-200',
      'Saúde': 'bg-red-100 text-red-800 border-red-200',
      'Educação': 'bg-purple-100 text-purple-800 border-purple-200',
      'Entretenimento': 'bg-pink-100 text-pink-800 border-pink-200',
      'Compras': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Investimentos': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Outros': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category] || colors['Outros'];
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodData = paymentMethods.find(pm => pm.value === method);
    return methodData?.icon || Wallet;
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Controle de Despesas
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {filteredExpenses.length} despesas
            </Badge>
            <Button
              onClick={() => setIsAddingExpense(true)}
              className="fintech-button gradient-primary text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Despesa
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar despesas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="fintech-label">Total Filtrado</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="fintech-label">Média por Despesa</p>
              <p className="text-lg font-semibold text-muted-foreground">
                R$ {filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
              </p>
            </div>
          </div>
        </div>

        {/* Add Expense Form */}
        {isAddingExpense && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Nova Despesa</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ex: Almoço no restaurante"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => {
                          const type = getCategoryType(category);
                          const typeLabel = type === 'essential' ? ' (Essencial)' : ' (Pessoal)';
                          return (
                            <SelectItem key={category} value={category}>
                              {category}{typeLabel}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
                    <Select value={newExpense.paymentMethod} onValueChange={(value) => setNewExpense(prev => ({ ...prev, paymentMethod: value }))}>
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
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="fintech-button gradient-primary text-white">
                    Adicionar Despesa
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingExpense(false)}
                    className="fintech-button"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterCategory !== 'all' 
                  ? 'Nenhuma despesa encontrada com os filtros aplicados'
                  : 'Nenhuma despesa registrada ainda'
                }
              </p>
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const PaymentIcon = getPaymentMethodIcon(expense.paymentMethod);
              return (
                <div key={expense.id} className="fintech-card p-4 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <PaymentIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{expense.description}</h4>
                          <Badge className={cn('text-xs', getCategoryColor(expense.category))}>
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {expense.date.toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {expense.type === 'essential' ? 'Essencial' : 'Pessoal'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-bold text-danger">
                          -R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {onEditExpense && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}