import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userService, type FinanceDivisionType } from '@/lib/user.service';
import { useNotification } from '@/hooks/useNotification';
import { Upload, User } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

const DIVISION_RULES = {
  RULE_50_30_20: { label: '50/30/20 - Equilibrado', bills: 50, expenses: 30, investments: 20 },
  RULE_50_20_30: { label: '50/20/30 - Mais Investimento', bills: 50, expenses: 20, investments: 30 },
  RULE_40_30_30: { label: '40/30/30 - Menos Contas', bills: 40, expenses: 30, investments: 30 },
  CUSTOM: { label: 'Personalizado', bills: 0, expenses: 0, investments: 0 },
};

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('');
  const [objectives, setObjectives] = useState('');
  const [salary, setSalary] = useState('');
  const [divisionType, setDivisionType] = useState<FinanceDivisionType>('RULE_50_30_20');
  const [billsPercentage, setBillsPercentage] = useState(50);
  const [expensesPercentage, setExpensesPercentage] = useState(30);
  const [investmentsPercentage, setInvestmentsPercentage] = useState(20);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivisionTypeChange = (value: FinanceDivisionType) => {
    setDivisionType(value);
    if (value !== 'CUSTOM') {
      const rule = DIVISION_RULES[value];
      setBillsPercentage(rule.bills);
      setExpensesPercentage(rule.expenses);
      setInvestmentsPercentage(rule.investments);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        error('Nome obrigatório', 'Por favor, informe seu nome');
        return;
      }
      setStep(2);
    }
  };

  const handleComplete = async () => {
    if (!salary || parseFloat(salary) <= 0) {
      error('Salário obrigatório', 'Por favor, informe seu salário mensal');
      return;
    }

    if (divisionType === 'CUSTOM') {
      const total = billsPercentage + expensesPercentage + investmentsPercentage;
      if (total !== 100) {
        error('Porcentagens inválidas', 'A soma deve ser 100%');
        return;
      }
    }

    setLoading(true);
    try {
      await userService.updateProfile({
        name,
        objectives: objectives || undefined,
        salary: parseFloat(salary),
        financeDivisionType: divisionType,
        ...(divisionType === 'CUSTOM' && {
          billsPercentage,
          expensesPercentage,
          investmentsPercentage,
        }),
      });
      
      if (photo) {
        localStorage.setItem('userPhoto', photo);
      }
      
      success('Perfil configurado!', 'Bem-vindo ao Clarity Cash');
      onComplete();
    } catch (err: any) {
      error('Erro ao salvar', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentRule = divisionType !== 'CUSTOM' ? DIVISION_RULES[divisionType] : null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? 'Complete seu perfil' : 'Configure suas finanças'}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? 'Vamos começar com suas informações pessoais'
              : 'Agora configure seu orçamento mensal'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photo} />
                <AvatarFallback className="text-2xl">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <Label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Upload className="h-4 w-4" />
                  Adicionar foto
                </div>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Objetivos financeiros</Label>
              <Textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                placeholder="Ex: Economizar para viagem, comprar casa..."
                rows={3}
              />
            </div>

            <Button onClick={handleNext} className="w-full">
              Próximo
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salário mensal (R$) *</Label>
              <Input
                id="salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="0.00"
                step="0.01"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="division">Regra de divisão financeira</Label>
              <Select value={divisionType} onValueChange={handleDivisionTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIVISION_RULES).map(([key, rule]) => (
                    <SelectItem key={key} value={key}>
                      {rule.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentRule && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">Divisão:</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-600">{currentRule.bills}%</p>
                    <p className="text-xs text-muted-foreground">Contas</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-orange-600">{currentRule.expenses}%</p>
                    <p className="text-xs text-muted-foreground">Gastos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{currentRule.investments}%</p>
                    <p className="text-xs text-muted-foreground">Investimentos</p>
                  </div>
                </div>
              </div>
            )}

            {divisionType === 'CUSTOM' && (
              <div className="space-y-4 p-4 border rounded-lg">
                <p className="text-sm font-medium">Defina as porcentagens (total = 100%):</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bills">Contas (%)</Label>
                    <Input
                      id="bills"
                      type="number"
                      value={billsPercentage}
                      onChange={(e) => setBillsPercentage(parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expenses">Gastos (%)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      value={expensesPercentage}
                      onChange={(e) => setExpensesPercentage(parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investments">Invest. (%)</Label>
                    <Input
                      id="investments"
                      type="number"
                      value={investmentsPercentage}
                      onChange={(e) => setInvestmentsPercentage(parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <p className={`text-sm text-center font-medium ${
                  billsPercentage + expensesPercentage + investmentsPercentage === 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  Total: {billsPercentage + expensesPercentage + investmentsPercentage}%
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                Voltar
              </Button>
              <Button onClick={handleComplete} className="w-full" disabled={loading}>
                {loading ? 'Salvando...' : 'Concluir'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
