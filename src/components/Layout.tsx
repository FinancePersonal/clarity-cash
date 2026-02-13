import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SkeletonCard } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ShortcutsModal } from '@/components/ui/shortcuts-modal';
import { useFinance } from '@/hooks/useFinance';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useTheme } from '@/hooks/useTheme';
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
  ChevronRight,
  LogOut,
  Shield,
  Lock
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard, description: 'Visão geral', locked: false },
  { name: 'Investimentos', href: '/app/investments', icon: TrendingUp, description: 'Patrimônio', locked: true },
  { name: 'Relatórios', href: '/app/reports', icon: BarChart3, description: 'Análises', locked: true },
  { name: 'Planejamento', href: '/app/planning', icon: Target, description: 'Metas', locked: true },
  { name: 'Histórico', href: '/app/history', icon: Clock, description: 'Transações', locked: true },
  { name: 'Admin', href: '/app/admin', icon: Shield, description: 'Painel Admin', locked: true },
  { name: 'Configurações', href: '/app/settings', icon: Settings, description: 'Ajustes', locked: false },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const finance = useFinance();
  const { setTheme } = useTheme();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      callback: () => document.querySelector('[data-testid="floating-action-button"]')?.click(),
      description: 'Nova despesa',
    },
    {
      key: 'd',
      ctrl: true,
      callback: () => navigate('/app'),
      description: 'Dashboard',
    },
    {
      key: 'r',
      ctrl: true,
      callback: () => navigate('/app/reports'),
      description: 'Relatórios',
    },
    {
      key: 't',
      ctrl: true,
      callback: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
      description: 'Alternar tema',
    },
    {
      key: '?',
      callback: () => setShortcutsOpen(true),
      description: 'Mostrar atalhos',
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/auth');
  };

  if (finance.isLoading) {
    return (
      <div className="min-h-screen gradient-background">
        <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-72">
          <div className="flex h-full flex-col glass border-r border-border/30">
            <div className="flex h-20 items-center border-b border-border/30 px-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 rounded-xl gradient-primary">
                    <Wallet2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Clarity Cash</h1>
                  <p className="text-xs text-muted-foreground font-medium">Carregando...</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <main className="lg:ml-72 pt-16 lg:pt-0">
          <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </main>
      </div>
    );
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
        const isActive = location.pathname === item.href || 
          (item.href === '/app' && location.pathname === '/app/');
        
        if (item.locked) {
          return (
            <div
              key={item.name}
              className="group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-muted-foreground">{item.name}</span>
                <p className="text-xs text-muted-foreground/70">
                  {item.description}
                </p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        }
        
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tema</span>
              <ThemeToggle />
            </div>
            
            <div className="fintech-card p-4 bg-gradient-to-br from-success/5 to-success/10 border-success/20 hover:from-success/8 hover:to-success/12 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="fintech-label-bold text-success">Disponível</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <p className="fintech-metric-large text-success mb-1">
                R$ {(finance.totalMonthlyIncome - finance.totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  'h-2 w-2 rounded-full animate-pulse',
                  status.color === 'text-success' ? 'bg-success' :
                  status.color === 'text-warning' ? 'bg-warning' : 'bg-danger'
                )} />
                <p className={cn('text-xs font-medium', status.color)}>
                  {status.text}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full fintech-button text-danger hover:bg-danger/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
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
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="fintech-button relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="container mx-auto px-6 lg:px-8 py-8 max-w-7xl">
          {children}
        </div>
      </main>

      {/* Shortcuts Modal */}
      <ShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}