import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ['Ctrl', 'N'], description: 'Nova despesa' },
  { keys: ['Ctrl', 'I'], description: 'Nova receita' },
  { keys: ['Ctrl', 'K'], description: 'Buscar' },
  { keys: ['Ctrl', 'T'], description: 'Alternar tema' },
  { keys: ['Ctrl', 'D'], description: 'Ir para Dashboard' },
  { keys: ['Ctrl', 'R'], description: 'Ir para Relatórios' },
  { keys: ['?'], description: 'Mostrar atalhos' },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" />
            Atalhos de Teclado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm text-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded shadow-sm">
                      {key === 'Ctrl' ? (
                        <Command className="h-3 w-3" />
                      ) : (
                        key
                      )}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            💡 Dica: Pressione <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">?</kbd> a qualquer momento para ver os atalhos
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
