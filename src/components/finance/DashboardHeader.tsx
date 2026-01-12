import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  onExportData?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DashboardHeader({
  selectedMonth,
  onMonthChange,
  onExportData,
  onRefresh,
  isLoading = false
}: DashboardHeaderProps) {
  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatMonthShort = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onMonthChange(newDate);
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return selectedMonth.getMonth() === now.getMonth() && 
           selectedMonth.getFullYear() === now.getFullYear();
  };

  const getCurrentDay = () => {
    return new Date().getDate();
  };

  const getDaysInMonth = () => {
    return new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0).getDate();
  };

  return (
    <div className="fintech-card p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Month Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="fintech-button h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border/50">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground capitalize">
                  {formatMonth(selectedMonth)}
                </h1>
                {isCurrentMonth() && (
                  <p className="text-sm text-muted-foreground">
                    Dia {getCurrentDay()} de {getDaysInMonth()}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="fintech-button h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {isCurrentMonth() && (
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Mês Atual
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMonthChange(new Date())}
            className="fintech-button"
          >
            Hoje
          </Button>
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="fintech-button"
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2",
                isLoading && "animate-spin"
              )} />
              Atualizar
            </Button>
          )}
          
          {onExportData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="fintech-button"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>
      
      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="fintech-label">Período</p>
            <p className="font-semibold text-foreground">{formatMonthShort(selectedMonth)}</p>
          </div>
          <div className="text-center">
            <p className="fintech-label">Status</p>
            <Badge variant={isCurrentMonth() ? "default" : "secondary"} className="font-medium">
              {isCurrentMonth() ? 'Ativo' : 'Histórico'}
            </Badge>
          </div>
          <div className="text-center">
            <p className="fintech-label">Sincronização</p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">Online</span>
            </div>
          </div>
          <div className="text-center">
            <p className="fintech-label">Última Atualização</p>
            <p className="text-sm font-medium text-muted-foreground">
              {new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}