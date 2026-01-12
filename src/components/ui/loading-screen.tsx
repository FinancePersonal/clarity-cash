import { Wallet } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <Wallet className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <div className="absolute inset-0 h-12 w-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Clarity Cash</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  );
}