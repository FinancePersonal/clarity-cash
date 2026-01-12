import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useFinance } from '@/hooks/useFinance';
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Settings, 
  History,
  Wallet,
  Menu,
  Plus,
  TrendingUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Planejamento', href: '/planning', icon: Calendar },
  { name: 'Histórico', href: '/history', icon: History },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const finance = useFinance();

  if (finance.isLoading) {
    return <LoadingScreen message="Carregando seus dados financeiros..." />;
  }

  // Get financial health status for smart microcopy
  const getHealthStatus = () => {
    if (!finance.isOnboarded) return null;
    const availableToSpend = finance.totalMonthlyIncome - finance.totalSpent;
    const percentage = finance.totalMonthlyIncome > 0 
      ? (finance.totalSpent / finance.totalMonthlyIncome) * 100 
      : 0;
    
    if (percentage <= 50) return { status: 'excellent', message: 'Excelente controle 💚', color: 'text-success' };
    if (percentage <= 70) return { status: 'good', message: 'Tudo sob controle ✨', color: 'text-success' };
    if (percentage <= 90) return { status: 'warning', message: 'Atenção aos gastos ⚠️', color: 'text-warning' };
    return { status: 'danger', message: 'Orçamento excedido ❌', color: 'text-danger' };
  };

  const healthStatus = getHealthStatus();

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={onItemClick}
          >
            <motion.div
              className={cn(
                'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
              whileHover={{ x: isActive ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator - left border */}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* Active background */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/20"
                  layoutId="activeNavBg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              <item.icon className={cn(
                "h-4 w-4 relative z-10 transition-colors",
                isActive && "text-primary"
              )} />
              <span className="relative z-10">{item.name}</span>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );

  const QuickActions = () => (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
        Ações Rápidas
      </p>
      {/* Primary CTA */}
      <Button 
        className="w-full justify-start gap-2 gradient-primary text-primary-foreground shadow-finance hover:shadow-finance-lg transition-all duration-200" 
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Nova Despesa
      </Button>
      {/* Secondary CTA */}
      <Button 
        variant="outline" 
        className="w-full justify-start gap-2 border-success/30 text-success hover:bg-success/10 hover:border-success/50 transition-all duration-200" 
        size="sm"
      >
        <TrendingUp className="h-4 w-4" />
        Nova Receita
      </Button>
    </div>
  );

  const FinancialStatusBadge = () => {
    if (!healthStatus) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
          healthStatus.status === 'excellent' && "bg-success/10 border border-success/20",
          healthStatus.status === 'good' && "bg-success/10 border border-success/20",
          healthStatus.status === 'warning' && "bg-warning/10 border border-warning/20",
          healthStatus.status === 'danger' && "bg-danger/10 border border-danger/20"
        )}
      >
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          healthStatus.status === 'excellent' && "bg-success",
          healthStatus.status === 'good' && "bg-success",
          healthStatus.status === 'warning' && "bg-warning",
          healthStatus.status === 'danger' && "bg-danger"
        )} />
        <span className={healthStatus.color}>{healthStatus.message}</span>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <BackgroundGradient />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-card/95 backdrop-blur-xl border-r border-border/50">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-6">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 rounded-xl gradient-primary shadow-glow">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">Clarity Cash</span>
            </motion.div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6">
            <NavItems />
            
            <div className="pt-4 border-t border-border/50">
              <QuickActions />
            </div>
          </nav>
          
          {/* Status Footer */}
          <div className="border-t border-border/50 p-4 space-y-3">
            <FinancialStatusBadge />
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span>Sincronizado</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex h-16 items-center justify-between px-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b border-border/50 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl gradient-primary shadow-glow">
                      <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Clarity Cash</span>
                  </div>
                </div>
                <nav className="flex-1 p-4 space-y-6">
                  <NavItems onItemClick={() => setSidebarOpen(false)} />
                  <div className="pt-4 border-t border-border/50">
                    <QuickActions />
                  </div>
                </nav>
                <div className="border-t border-border/50 p-4 space-y-3">
                  <FinancialStatusBadge />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span>Sincronizado</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary shadow-glow">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Clarity Cash</span>
          </div>
          
          {/* Mobile status indicator */}
          {healthStatus && (
            <div className={cn(
              "w-2.5 h-2.5 rounded-full",
              healthStatus.status === 'excellent' && "bg-success",
              healthStatus.status === 'good' && "bg-success",
              healthStatus.status === 'warning' && "bg-warning",
              healthStatus.status === 'danger' && "bg-danger"
            )} />
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="container mx-auto px-4 lg:px-8 py-8 max-w-7xl relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
