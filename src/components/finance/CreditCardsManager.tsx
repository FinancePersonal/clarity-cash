import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, CreditCard, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard as CreditCardType } from '@/types/finance';

interface CreditCardsManagerProps {
  creditCards: CreditCardType[];
  onAdd: (card: Omit<CreditCardType, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CreditCardType>) => void;
  onRemove: (id: string) => void;
  getCreditCardUsage: (cardId: string) => { used: number; available: number; percent: number };
  selectedMonth: Date;
}

const cardColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export function CreditCardsManager({ 
  creditCards, 
  onAdd, 
  onUpdate, 
  onRemove, 
  getCreditCardUsage,
  selectedMonth 
}: CreditCardsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    dueDay: '10',
    color: cardColors[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.limit) return;

    if (editingId) {
      onUpdate(editingId, {
        name: formData.name,
        limit: parseFloat(formData.limit),
        dueDay: parseInt(formData.dueDay),
        color: formData.color
      });
      setEditingId(null);
    } else {
      onAdd({
        name: formData.name,
        limit: parseFloat(formData.limit),
        dueDay: parseInt(formData.dueDay),
        color: formData.color,
        isActive: true
      });
      setIsAdding(false);
    }

    setFormData({ name: '', limit: '', dueDay: '10', color: cardColors[0] });
  };

  const startEdit = (card: CreditCardType) => {
    setFormData({
      name: card.name,
      limit: card.limit.toString(),
      dueDay: card.dueDay.toString(),
      color: card.color
    });
    setEditingId(card.id);
    setIsAdding(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getBillMonth = (dueDay: number) => {
    const today = new Date();
    const billMonth = new Date(selectedMonth);
    
    if (today.getDate() > dueDay) {
      billMonth.setMonth(billMonth.getMonth() + 1);
    }
    
    return billMonth.toLocaleDateString('pt-BR', { month: 'long' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Cartões de Crédito</h2>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Cartão
        </Button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Editar' : 'Novo'} Cartão</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Cartão</Label>
                    <Input
                      placeholder="Ex: Nubank, Itaú"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Limite</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.limit}
                      onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Dia do Vencimento</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.dueDay}
                      onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Cor</Label>
                    <div className="flex gap-2">
                      {cardColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 ${
                            formData.color === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Salvar' : 'Adicionar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsAdding(false);
                      setEditingId(null);
                      setFormData({ name: '', limit: '', dueDay: '10', color: cardColors[0] });
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4">
        {creditCards.map(card => {
          const usage = getCreditCardUsage(card.id);
          return (
            <Card key={card.id} className="overflow-hidden">
              <div 
                className="h-2"
                style={{ backgroundColor: card.color }}
              />
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: card.color }}
                    >
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Fatura {getBillMonth(card.dueDay)} • Vence dia {card.dueDay}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(card)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onRemove(card.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Usado</p>
                    <p className="font-semibold">{formatCurrency(usage.used)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disponível</p>
                    <p className="font-semibold text-green-600">{formatCurrency(usage.available)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Limite</p>
                    <p className="font-semibold">{formatCurrency(card.limit)}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilização</span>
                    <span>{usage.percent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${Math.min(usage.percent, 100)}%`,
                        backgroundColor: usage.percent > 80 ? '#EF4444' : usage.percent > 60 ? '#F59E0B' : card.color
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {creditCards.length === 0 && !isAdding && (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Nenhum cartão cadastrado</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cartão
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}