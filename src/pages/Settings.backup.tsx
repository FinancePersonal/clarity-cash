import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotification } from '@/hooks/useNotification';
import { userService, type UserProfile, type FinanceDivisionType } from '@/lib/user.service';
import { authService } from '@/lib/auth.service';
import { User, DollarSign, Trash2, Save, LogOut } from 'lucide-react';

const DIVISION_RULES = {
  RULE_50_30_20: { label: '50/30/20 (Contas/Gastos/Investimentos)', bills: 50, expenses: 30, investments: 20 },
  RULE_50_20_30: { label: '50/20/30 (Contas/Gastos/Investimentos)', bills: 50, expenses: 20, investments: 30 },
  RULE_40_30_30: { label: '40/30/30 (Contas/Gastos/Investimentos)', bills: 40, expenses: 30, investments: 30 },
  CUSTOM: { label: 'Personalizado', bills: 0, expenses: 0, investments: 0 },
};

export default function Settings() {
  const { success, error } = useNotification();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState('');
  const [objectives, setObjectives] = useState('');
  const [salary, setSalary] = useState('');
  const [divisionType, setDivisionType] = useState<FinanceDivisionType>('RULE_50_30_20');
  const [billsPercentage, setBillsPercentage] = useState(50);
  const [expensesPercentage, setExpensesPercentage] = useState(30);
  const [investmentsPercentage, setInvestmentsPercentage] = useState(20);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setName(data.name);
      setObjectives(data.objectives || '');
      setSalary(data.salary?.toString() || '');
      setDivisionType(data.financeDivisionType);
      setBillsPercentage(data.billsPercentage);
      setExpensesPercentage(data.expensesPercentage);
      setInvestmentsPercentage(data.investmentsPercentage);
    } catch (err: any) {
      error('Erro ao carregar perfil', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
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

  const handleSaveProfile = async () => {
    if (divisionType === 'CUSTOM') {
      const total = billsPercentage + expensesPercentage + investmentsPercentage;
      if (total !== 100) {
        error('Porcentagens inválidas', 'A soma das porcentagens deve ser 100%');
        return;
      }
    }

    setSaving(true);
    try {
      await userService.updateProfile({
        name,
        objectives: objectives || undefined,
        salary: salary ? parseFloat(salary) : undefined,
        financeDivisionType: divisionType,
        ...(divisionType === 'CUSTOM' && {
          billsPercentage,
          expensesPercentage,
          investmentsPercentage,
        }),
      });
      success('Perfil atualizado!', 'Suas configurações foram salvas');
    } catch (err: any) {
      error('Erro ao salvar', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      await userService.deleteAccount();
      authService.logout();
    } catch (err: any) {
      error('Erro ao excluir conta', err.response?.data?.message || err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentRule = divisionType !== 'CUSTOM' ? DIVISION_RULES[divisionType] : null;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie seu perfil e preferências financeiras</p>
        </div>
        <Button variant="outline" onClick={() => authService.logout()}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="finance">
            <DollarSign className="h-4 w-4 mr-2" />
            Finanças
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize seus dados pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos Financeiros</Label>
                <Textarea
                  id="objectives"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Descreva seus objetivos financeiros..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Financeiras</CardTitle>
              <CardDescription>Configure sua renda e divisão de orçamento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salary">Salário Mensal (R$)</Label>
                <Input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="division">Regra de Divisão Financeira</Label>
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
                  <p className="text-sm font-medium">Divisão Automática:</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{currentRule.bills}%</p>
                      <p className="text-xs text-muted-foreground">Contas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{currentRule.expenses}%</p>
                      <p className="text-xs text-muted-foreground">Gastos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{currentRule.investments}%</p>
                      <p className="text-xs text-muted-foreground">Investimentos</p>
                    </div>
                  </div>
                </div>
              )}

              {divisionType === 'CUSTOM' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <p className="text-sm font-medium">Defina as porcentagens (total deve ser 100%):</p>
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
                      <Label htmlFor="investments">Investimentos (%)</Label>
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
                  <div className="text-center">
                    <p className={`text-sm font-medium ${
                      billsPercentage + expensesPercentage + investmentsPercentage === 100
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      Total: {billsPercentage + expensesPercentage + investmentsPercentage}%
                    </p>
                  </div>
                </div>
              )}

              <Button onClick={handleSaveProfile} className="w-full" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDeleteAccount} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta Permanentemente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
