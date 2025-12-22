import { motion } from 'framer-motion';
import { Settings, RefreshCw, ChevronLeft, ChevronRight, Calendar, Moon, Sun, TrendingUp, Target, LogOut, History } from 'lucide-react';
import { userService } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface HeaderProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
  onReset?: () => void;
}

export function Header({ selectedMonth, onMonthChange, onReset }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleLogout = () => {
    userService.logout();
    window.location.reload();
  };

  const currentMonth = new Intl.DateTimeFormat('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).format(selectedMonth);

  const goToPreviousMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    onMonthChange(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    onMonthChange(newMonth);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const isCurrentMonth = selectedMonth.getMonth() === new Date().getMonth() && 
                       selectedMonth.getFullYear() === new Date().getFullYear();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">FinTrack</h1>
        <div className="flex items-center gap-3 mt-2">
          <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="capitalize font-medium">{currentMonth}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedMonth}
                onSelect={(date) => date && onMonthChange(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          {!isCurrentMonth && (
            <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
              Hoje
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onReset && (
          <Button variant="ghost" size="icon" onClick={onReset} title="Resetar dados">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme} title="Alternar tema">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <Link to="/history">
          <Button variant="ghost" size="icon" title="Histórico">
            <History className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/reports">
          <Button variant="ghost" size="icon" title="Relatórios">
            <TrendingUp className="w-4 h-4" />
          </Button>
        </Link>
        <Link to="/planning">
          <Button variant="ghost" size="icon" title="Planejamento">
            <Target className="w-4 h-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
          <LogOut className="w-4 h-4" />
        </Button>
        <Link to="/settings">
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.header>
  );
}
