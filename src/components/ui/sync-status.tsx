import { motion } from 'framer-motion';
import { Loader2, Cloud, CloudOff } from 'lucide-react';

interface SyncStatusProps {
  isLoading?: boolean;
  isSyncing?: boolean;
}

export function SyncStatus({ isLoading, isSyncing }: SyncStatusProps) {
  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shadow-lg"
        >
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </motion.div>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2 shadow-lg"
        >
          <Cloud className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">Sincronizando...</span>
        </motion.div>
      </div>
    );
  }

  return null;
}