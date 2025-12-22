import { motion } from 'framer-motion';
import { Settings, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset?: () => void;
}

export function Header({ onReset }: HeaderProps) {
  const currentMonth = new Intl.DateTimeFormat('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between py-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">FinTrack</h1>
        <p className="text-sm text-muted-foreground capitalize">{currentMonth}</p>
      </div>
      <div className="flex items-center gap-2">
        {onReset && (
          <Button variant="ghost" size="icon" onClick={onReset} title="Resetar dados">
            <RefreshCw className="w-4 h-4" />
          </Button>
        )}
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </motion.header>
  );
}
