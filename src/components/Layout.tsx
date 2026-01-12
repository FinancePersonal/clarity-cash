import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useFinance } from '@/hooks/useFinance';
import { 
  LayoutDashboard, 
  BarChart3, 
  Target, 
  Clock,
  Settings,
  Menu,
  TrendingUp,
  Wallet2,
  Bell,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Visão geral' },
  { name: 'Investimentos', href: '/investments', icon: TrendingUp, description: 'Patrimônio' },
  { name: 'Relatórios', href: '/reports', icon: BarChart3, description: 'Análises' },
  { name: 'Planejamento', href: '/planning', icon: Target, description: 'Metas' },
  { name: 'Histórico', href: '/history', icon: Clock, description: 'Transações' },
  { name: 'Configurações', href: '/settings', icon: Settings, description: 'Ajustes' },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const finance = useFinance();

  if (finance.isLoading) {
    return <LoadingScreen message="Carregando seus dados financeiros..." />;
  }

  const getFinancialStatus = () => {
    const totalUsed = finance.totalSpent + finance.investmentSpent;
    const usagePercentage = (totalUsed / finance.totalMonthlyIncome) * 100;
    if (usagePercentage > 90) return { text: 'Atenção ao orçamento ⚠️', color: 'text-warning' };
    if (usagePercentage > 75) return { text: 'Controle moderado 📊', color: 'text-primary' };
    return { text: 'Excelente controle 💚', color: 'text-success' };
  };

  const status = getFinancialStatus();

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02]',
              isActive
                ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-sm border-l-4 border-primary'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground border-l-4 border-transparent'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className={cn(
              'h-5 w-5 transition-all duration-300',
              isActive ? 'scale-110 text-primary' : 'group-hover:scale-105'
            )} />
            <div className="flex-1">
              <span className="font-medium">{item.name}</span>
              <p className={cn(
                'text-xs transition-colors duration-300',
                isActive ? 'text-primary/70' : 'text-muted-foreground/70'
              )}>
                {item.description}
              </p>
            </div>
            {isActive && (
              <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen gradient-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72">
        <div className="flex h-full flex-col glass border-r border-border/30">
          {/* Logo */}
          <div className="flex h-20 items-center border-b border-border/30 px-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-primary/20 blur-sm group-hover:blur-md transition-all duration-300" />
                <div className="relative p-3 rounded-xl gradient-primary group-hover:scale-105 transition-transform duration-300">
                  <Wallet2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Clarity Cash</h1>
                <p className="text-xs text-muted-foreground font-medium">Controle Inteligente</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-6">
            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Menu Principal
              </p>
              <div className="space-y-1">
                <NavItems />
              </div>
            </div>
          </nav>
          
          {/* Enhanced Status & Quick Stats */}
          <div className="border-t border-border/30 p-6 space-y-4">
            <div className="fintech-card p-4 bg-gradient-to-br from-success/5 to-success/10 border-success/20">
              <div className="flex items-center justify-between mb-3">
                <span className="fintech-label">Saldo Disponível</span>
                <TrendingUp className="h-4 w-4 text-success animate-pulse" />
              </div>
              <p className="fintech-metric text-success mb-2">
                R$ {(finance.totalMonthlyIncome - finance.totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className={cn('text-xs font-medium', status.color)}>
                {status.text}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="font-medium">Sistema Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fintech-button">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 glass">
                <div className="flex h-full flex-col">
                  <div className="flex h-20 items-center border-b border-border/30 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-primary/20 blur-sm" />
                        <div className="relative p-3 rounded-xl gradient-primary">
                          <Wallet2 className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h1 className="text-xl font-bold">Clarity Cash</h1>
                        <p className="text-xs text-muted-foreground font-medium">Controle Inteligente</p>
                      </div>
                    </div>
                  </div>
                  <nav className="flex-1 space-y-2 p-6">
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                        Menu Principal
                      </p>
                      <div className="space-y-1">
                        <NavItems />
                      </div>
                    </div>
                  </nav>
                  <div className="border-t border-border/30 p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="font-medium">Sistema Online</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
                <div className="relative p-2 rounded-lg gradient-primary">
                  <Wallet2 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold">Clarity Cash</h1>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="fintech-button relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}