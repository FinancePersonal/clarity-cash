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
  TrendingUp,
  Trash2,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { investmentCategoryLabels, investmentCategoryIcons, type Investment, type InvestmentCategory } from '@/types/finance';

interface InvestmentTrackerProps {
  investments: Investment[];
  onAddInvestment: (investment: Omit<Investment, 'id'>) => void;
  onDeleteInvestment: (id: string) => void;
}

const investmentCategories: InvestmentCategory[] = [
  'fixed_income',
  'stocks', 
  'real_estate_funds',
  'crypto',
  'other_investments'
];

export function InvestmentTracker({ 
  investments, 
  onAddInvestment, 
  onDeleteInvestment 
}: InvestmentTrackerProps) {
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [newInvestment, setNewInvestment] = useState({
    description: '',
    amount: '',
    category: '' as InvestmentCategory | ''
  });

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = filterCategory === 'all' || investment.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestment.description || !newInvestment.amount || !newInvestment.category) return;

    onAddInvestment({
      description: newInvestment.description,
      amount: parseFloat(newInvestment.amount),
      category: newInvestment.category,
      date: new Date(),
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });

    setNewInvestment({
      description: '',
      amount: '',
      category: ''
    });
    setIsAddingInvestment(false);
  };

  const getCategoryColor = (category: InvestmentCategory) => {
    const colors: Record<InvestmentCategory, string> = {
      'fixed_income': 'bg-blue-100 text-blue-800 border-blue-200',
      'stocks': 'bg-green-100 text-green-800 border-green-200',
      'real_estate_funds': 'bg-orange-100 text-orange-800 border-orange-200',
      'crypto': 'bg-purple-100 text-purple-800 border-purple-200',
      'other_investments': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[category];
  };

  const totalInvestments = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);

  const categoryDistribution = investmentCategories.map(category => {
    const categoryInvestments = filteredInvestments.filter(i => i.category === category);
    const total = categoryInvestments.reduce((sum, i) => sum + i.amount, 0);
    const percentage = totalInvestments > 0 ? (total / totalInvestments) * 100 : 0;
    
    return {
      category,
      total,
      percentage,
      count: categoryInvestments.length
    };
  }).filter(item => item.total > 0);

  return (
    <Card className="fintech-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Controle de Investimentos
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-success/10 text-success">
              {filteredInvestments.length} investimentos
            </Badge>
            <Button
              onClick={() => setIsAddingInvestment(true)}
              className="fintech-button bg-success hover:bg-success/90 text-white"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Investimento
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
              placeholder="Buscar investimentos..."
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
              {investmentCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {investmentCategoryLabels[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label text-success">Total Investido</p>
                <p className="text-2xl font-bold text-success">
                  R$ {totalInvestments.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="fintech-label">Média por Investimento</p>
                <p className="text-lg font-semibold text-muted-foreground">
                  R$ {filteredInvestments.length > 0 ? (totalInvestments / filteredInvestments.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </p>
              </div>
              <PieChart className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        {categoryDistribution.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Distribuição por Categoria</h4>
            <div className="grid gap-2">
              {categoryDistribution.map(({ category, total, percentage, count }) => (
                <div key={category} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{investmentCategoryLabels[category]}</p>
                      <p className="text-sm text-muted-foreground">{count} investimento{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Investment Form */}
        {isAddingInvestment && (
          <Card className="border-success/20 bg-success/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-success">Novo Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Input
                      id="description"
                      value={newInvestment.description}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Ex: Tesouro Direto IPCA+"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Valor Investido</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={newInvestment.amount}
                      onChange={(e) => setNewInvestment(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0,00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria do Investimento</Label>
                  <Select value={newInvestment.category} onValueChange={(value: InvestmentCategory) => setNewInvestment(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {investmentCategoryLabels[category]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    className="flex-1 fintech-button bg-success hover:bg-success/90 text-white"
                  >
                    Adicionar Investimento
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddingInvestment(false)}
                    className="fintech-button"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Investment List */}
        <div className="space-y-3">
          {filteredInvestments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum investimento encontrado</p>
              <p className="text-sm">Comece a construir seu patrimônio!</p>
            </div>
          ) : (
            filteredInvestments.map((investment) => (
              <div
                key={investment.id}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50 hover:border-success/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{investment.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={cn("text-xs", getCategoryColor(investment.category))}>
                        {investmentCategoryLabels[investment.category]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {investment.date.toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-success">
                      R$ {investment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteInvestment(investment.id)}
                    className="text-danger hover:text-danger hover:bg-danger/10"
                  >
                    <Trash2 className="h-4 w-4" />
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