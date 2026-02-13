import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNotification } from '@/hooks/useNotification';
import { userService, type UserProfile, type FinanceDivisionType } from '@/lib/user.service';
import { authService } from '@/lib/auth.service';
import { User, DollarSign, Trash2, Save, LogOut, Upload, Target, TrendingUp, Wallet } from 'lucide-react';

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
  const [photo, setPhoto] = useState('');
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
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setName(data.name);
      setObjectives(data.objectives || '');
      setSalary(data.salary?.toString() || '');
      setDivisionType(data.financeDivisionType);
      setBillsPercentage(data.billsPercentage);
      setExpensesPercentage(data.expensesPercentage);
      setInvestmentsPercentage(data.investmentsPercentage);
      
      const savedPhoto = localStorage.getItem('userPhoto');
      if (savedPhoto) setPhoto(savedPhoto);
    } catch (err: any) {
      error('Erro ao carregar perfil', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhoto(result);
        localStorage.setItem('userPhoto', result);
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
    <div className="space-y-6 fade-in max-w-5xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Configurações</h1>
          <p className="text-muted-foreground mt-2">Gerencie seu perfil e preferências financeiras</p>
        </div>
        <Button variant="outline" onClick={() => authService.logout()} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-12">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="finance" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Finanças
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Atualize seus dados pessoais e foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex flex-col items-center gap-4 pb-6 border-b">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src={photo} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/20 to-primary/10">
                    <User className="h-16 w-16 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    <Upload className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Alterar foto</span>
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

              <div className="space-y-3">
                <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nome completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="h-12 text-base bg-muted/50"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Email não pode ser alterado
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="objectives" className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  Objetivos Financeiros
                </Label>
                <Textarea
                  id="objectives"
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Descreva seus objetivos financeiros...&#10;Ex: Economizar para viagem, comprar casa, investir em educação"
                  rows={4}
                  className="text-base resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Configurações Financeiras
              </CardTitle>
              <CardDescription>Configure sua renda e divisão de orçamento</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="salary" className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Salário Mensal
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                  <Input
                    id="salary"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    className="h-14 text-lg pl-12 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="division" className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Regra de Divisão Financeira
                </Label>
                <Select value={divisionType} onValueChange={handleDivisionTypeChange}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DIVISION_RULES).map(([key, rule]) => (
                      <SelectItem key={key} value={key} className="text-base">
                        {rule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentRule && (
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <p className="text-sm font-semibold text-muted-foreground mb-4">Divisão Automática:</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600 mb-1">{currentRule.bills}%</p>
                      <p className="text-xs font-medium text-muted-foreground">Contas Essenciais</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600 mb-1">{currentRule.expenses}%</p>
                      <p className="text-xs font-medium text-muted-foreground">Gastos Pessoais</p>
                    </div>
                    <div className="text-center p-4 bg-background/50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600 mb-1">{currentRule.investments}%</p>
                      <p className="text-xs font-medium text-muted-foreground">Investimentos</p>
                    </div>
                  </div>
                </div>
              )}

              {divisionType === 'CUSTOM' && (
                <div className="space-y-4 p-6 border-2 border-dashed rounded-xl bg-muted/30">
                  <p className="text-sm font-semibold text-center">Defina as porcentagens (total deve ser 100%):</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bills" className="text-sm font-medium">Contas (%)</Label>
                      <Input
                        id="bills"
                        type="number"
                        value={billsPercentage}
                        onChange={(e) => setBillsPercentage(parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-12 text-center text-lg font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenses" className="text-sm font-medium">Gastos (%)</Label>
                      <Input
                        id="expenses"
                        type="number"
                        value={expensesPercentage}
                        onChange={(e) => setExpensesPercentage(parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-12 text-center text-lg font-semibold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investments" className="text-sm font-medium">Invest. (%)</Label>
                      <Input
                        id="investments"
                        type="number"
                        value={investmentsPercentage}
                        onChange={(e) => setInvestmentsPercentage(parseInt(e.target.value) || 0)}
                        min="0"
                        max="100"
                        className="h-12 text-center text-lg font-semibold"
                      />
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <p className={`text-base font-bold ${
                      billsPercentage + expensesPercentage + investmentsPercentage === 100
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      Total: {billsPercentage + expensesPercentage + investmentsPercentage}%
                    </p>
                  </div>
                </div>
              )}

              <Button onClick={handleSaveProfile} className="w-full h-12 text-base gap-2" disabled={saving}>
                <Save className="h-5 w-5" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 shadow-lg">
            <CardHeader className="border-b bg-destructive/5">
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>Ações irreversíveis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Button onClick={handleDeleteAccount} variant="destructive" className="w-full h-12 text-base gap-2">
                <Trash2 className="h-5 w-5" />
                Excluir Conta Permanentemente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
