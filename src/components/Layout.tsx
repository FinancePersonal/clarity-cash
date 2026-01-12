import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Menu
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

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <BackgroundGradient />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64">
        <div className="flex h-full flex-col bg-card/95 backdrop-blur-sm border-r border-border/50">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-lg text-foreground">Clarity Cash</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            <NavItems />
          </nav>
          
          {/* Status */}
          <div className="border-t border-border/50 p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex h-16 items-center px-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-16 items-center border-b px-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-lg">Clarity Cash</span>
                  </div>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <NavItems />
                </nav>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2 ml-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Clarity Cash</span>
          </div>
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