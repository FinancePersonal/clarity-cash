import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BudgetRule } from '@/types/finance';

interface OnboardingProps {
  onComplete: (income: number, budgetRule: BudgetRule, creditCardLimit: number) => void;
}

const presetRules = [
  { name: '50-30-20', essentials: 50, personal: 30, investments: 20, description: 'Clássica e equilibrada' },
  { name: '60-25-15', essentials: 60, personal: 25, investments: 15, description: 'Foco em necessidades' },
  { name: '40-30-30', essentials: 40, personal: 30, investments: 30, description: 'Foco em investimentos' },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customRule, setCustomRule] = useState<BudgetRule>({ essentials: 50, personal: 30, investments: 20 });
  const [isCustom, setIsCustom] = useState(false);
  const [creditCardLimit, setCreditCardLimit] = useState('');

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      const rule = isCustom ? customRule : presetRules[selectedPreset];
      onComplete(
        parseFloat(income) || 0,
        { essentials: rule.essentials, personal: rule.personal, investments: rule.investments },
        parseFloat(creditCardLimit) || 0
      );
    }
  };

  const isStepValid = () => {
    if (step === 1) return parseFloat(income) > 0;
    if (step === 2) {
      if (isCustom) {
        const total = customRule.essentials + customRule.personal + customRule.investments;
        return total === 100;
      }
      return true;
    }
    return true;
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-4 w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow"
            >
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-2xl">
              {step === 1 && 'Qual sua renda mensal?'}
              {step === 2 && 'Como dividir seu dinheiro?'}
              {step === 3 && 'Limite do cartão de crédito'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Informe sua renda líquida mensal para começarmos'}
              {step === 2 && 'Escolha uma regra de divisão ou crie a sua'}
              {step === 3 && 'Opcional: para controlar seus gastos no cartão'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Progress */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Income */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="income">Renda mensal</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="income"
                      type="number"
                      placeholder="0,00"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="pl-10 text-2xl font-bold h-14"
                      autoFocus
                    />
                  </div>
                </div>
                {income && parseFloat(income) > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    {formatCurrency(income)} por mês
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 2: Budget Rule */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  {presetRules.map((rule, index) => (
                    <button
                      key={rule.name}
                      onClick={() => {
                        setSelectedPreset(index);
                        setIsCustom(false);
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        !isCustom && selectedPreset === index
                          ? 'border-primary bg-primary/5 ring-2 ring-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{rule.name}</p>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">
                            {rule.essentials}% • {rule.personal}% • {rule.investments}%
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setIsCustom(true)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      isCustom
                        ? 'border-primary bg-primary/5 ring-2 ring-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold">Personalizado</p>
                    <p className="text-sm text-muted-foreground">Defina seus próprios percentuais</p>
                  </button>
                </div>

                {isCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 pt-2"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Essenciais</Label>
                        <Input
                          type="number"
                          value={customRule.essentials}
                          onChange={(e) => setCustomRule({ ...customRule, essentials: parseInt(e.target.value) || 0 })}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Pessoais</Label>
                        <Input
                          type="number"
                          value={customRule.personal}
                          onChange={(e) => setCustomRule({ ...customRule, personal: parseInt(e.target.value) || 0 })}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Investimentos</Label>
                        <Input
                          type="number"
                          value={customRule.investments}
                          onChange={(e) => setCustomRule({ ...customRule, investments: parseInt(e.target.value) || 0 })}
                          className="text-center"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    <p className={`text-sm text-center ${
                      customRule.essentials + customRule.personal + customRule.investments === 100
                        ? 'text-success'
                        : 'text-danger'
                    }`}>
                      Total: {customRule.essentials + customRule.personal + customRule.investments}% 
                      {customRule.essentials + customRule.personal + customRule.investments !== 100 && ' (deve ser 100%)'}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 3: Credit Card */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Limite do cartão (opcional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="creditLimit"
                      type="number"
                      placeholder="0,00"
                      value={creditCardLimit}
                      onChange={(e) => setCreditCardLimit(e.target.value)}
                      className="pl-10 text-xl font-semibold h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Você pode pular essa etapa e configurar depois
                  </p>
                </div>
              </motion.div>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step < 3 ? (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Começar a usar'
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
