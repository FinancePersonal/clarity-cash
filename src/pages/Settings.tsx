import { useFinance } from '@/hooks/useFinance';
import { CreditCardsManager } from '@/components/finance/CreditCardsManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Settings = () => {
  const finance = useFinance();

  if (finance.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  const bankStatementExpenses = finance.getBankStatementExpenses();
  const totalBankStatement = bankStatementExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CreditCardsManager
            creditCards={finance.creditCards}
            onAdd={finance.addCreditCard}
            onUpdate={finance.updateCreditCard}
            onRemove={finance.removeCreditCard}
            getCreditCardUsage={finance.getCreditCardUsage}
            selectedMonth={finance.selectedMonth}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Extrato Bancário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total no extrato</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalBankStatement)}</p>
                </div>
                
                {bankStatementExpenses.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {bankStatementExpenses.map(expense => (
                      <div key={expense.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                        <span className="text-sm">{expense.description}</span>
                        <span className="font-medium">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum gasto marcado para aparecer no extrato
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;