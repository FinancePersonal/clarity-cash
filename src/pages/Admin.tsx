import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { CircularProgress } from '@/components/ui/circular-progress';
import { useNotification } from '@/hooks/useNotification';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Search,
  Eye,
  Trash2,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  CreditCard,
  Calendar
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  creditCards: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'blocked';
}

const Admin = () => {
  const { success, error } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@email.com',
      createdAt: '2024-01-15',
      totalIncome: 5000,
      totalExpenses: 3200,
      totalInvestments: 800,
      creditCards: 2,
      lastActive: '2024-01-20',
      status: 'active'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      createdAt: '2024-01-10',
      totalIncome: 7500,
      totalExpenses: 4800,
      totalInvestments: 1500,
      creditCards: 3,
      lastActive: '2024-01-19',
      status: 'active'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      createdAt: '2024-01-05',
      totalIncome: 4200,
      totalExpenses: 3800,
      totalInvestments: 400,
      creditCards: 1,
      lastActive: '2024-01-18',
      status: 'inactive'
    }
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalIncome, 0),
    totalExpenses: users.reduce((sum, u) => sum + u.totalExpenses, 0),
    totalInvestments: users.reduce((sum, u) => sum + u.totalInvestments, 0),
    avgIncome: users.reduce((sum, u) => sum + u.totalIncome, 0) / users.length,
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' as const } : u
    ));
    success('Status atualizado', 'Usuário bloqueado/desbloqueado com sucesso');
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
      success('Usuário excluído', 'Dados removidos permanentemente');
    }
  };

  const handleExportData = () => {
    const data = {
      stats,
      users,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Relatório exportado', 'Dados salvos com sucesso');
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie usuários e monitore o sistema</p>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="fintech-card-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.activeUsers} ativos
                </p>
              </div>
              <CircularProgress value={stats.activeUsers} max={stats.totalUsers} size="md" variant="success" />
            </div>
          </CardContent>
        </Card>

        <Card className="fintech-card-success">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Média: {formatCurrency(stats.avgIncome)}
            </p>
          </CardContent>
        </Card>

        <Card className="fintech-card-danger">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Despesas Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-danger">{formatCurrency(stats.totalExpenses)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.totalExpenses / stats.totalRevenue) * 100).toFixed(1)}% da receita
            </p>
          </CardContent>
        </Card>

        <Card className="fintech-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">{formatCurrency(stats.totalInvestments)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {((stats.totalInvestments / stats.totalRevenue) * 100).toFixed(1)}% da receita
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>{filteredUsers.length} usuários encontrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{user.name}</p>
                          <StatusBadge
                            variant={
                              user.status === 'active' ? 'success' :
                              user.status === 'blocked' ? 'danger' : 'neutral'
                            }
                          >
                            {user.status === 'active' ? 'Ativo' :
                             user.status === 'blocked' ? 'Bloqueado' : 'Inativo'}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Desde {formatDate(user.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {user.creditCards} cartões
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-success">
                          {formatCurrency(user.totalIncome)}
                        </p>
                        <p className="text-xs text-muted-foreground">Receita</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-danger">
                          {formatCurrency(user.totalExpenses)}
                        </p>
                        <p className="text-xs text-muted-foreground">Despesas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBlockUser(user.id)}
                      >
                        {user.status === 'blocked' ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-warning" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4 text-danger" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Details Modal */}
          {selectedUser && (
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detalhes do Usuário</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                    Fechar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-semibold">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-semibold">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                      <p className="font-semibold">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Último Acesso</p>
                      <p className="font-semibold">{formatDate(selectedUser.lastActive)}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Receita Total</p>
                      <p className="font-semibold text-success text-xl">
                        {formatCurrency(selectedUser.totalIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Despesas Totais</p>
                      <p className="font-semibold text-danger text-xl">
                        {formatCurrency(selectedUser.totalExpenses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Investimentos</p>
                      <p className="font-semibold text-primary text-xl">
                        {formatCurrency(selectedUser.totalInvestments)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cartões de Crédito</p>
                      <p className="font-semibold">{selectedUser.creditCards} cartões</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuários Ativos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success"
                          style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{stats.activeUsers}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Usuários Inativos</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning"
                          style={{ width: `${((stats.totalUsers - stats.activeUsers) / stats.totalUsers) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{stats.totalUsers - stats.activeUsers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                    <span className="text-sm font-medium">Total de Receitas</span>
                    <span className="font-bold text-success">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-danger/5 rounded-lg">
                    <span className="text-sm font-medium">Total de Despesas</span>
                    <span className="font-bold text-danger">{formatCurrency(stats.totalExpenses)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <span className="text-sm font-medium">Total Investido</span>
                    <span className="font-bold text-primary">{formatCurrency(stats.totalInvestments)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
