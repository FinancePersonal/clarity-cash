import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Bell, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/types/finance';
import { cn } from '@/lib/utils';

interface AlertsProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export function Alerts({ alerts, onDismiss }: AlertsProps) {
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  if (unreadAlerts.length === 0) return null;

  const getIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'danger':
        return <TrendingDown className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const getStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'danger':
        return {
          bg: 'bg-danger/5',
          border: 'border-danger/20',
          iconBg: 'bg-danger/10',
          iconColor: 'text-danger',
          titleColor: 'text-danger',
        };
      case 'warning':
        return {
          bg: 'bg-warning/5',
          border: 'border-warning/20',
          iconBg: 'bg-warning/10',
          iconColor: 'text-warning',
          titleColor: 'text-warning',
        };
      default:
        return {
          bg: 'bg-primary/5',
          border: 'border-primary/20',
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          titleColor: 'text-primary',
        };
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence mode="popLayout">
        {unreadAlerts.slice(0, 3).map((alert, index) => {
          const styles = getStyles(alert.severity);
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              layout
            >
              <Card className={cn(
                "border shadow-finance-lg backdrop-blur-sm overflow-hidden",
                styles.bg,
                styles.border
              )}>
                {/* Top accent bar */}
                <div className={cn(
                  "h-1",
                  alert.severity === 'danger' && "bg-danger",
                  alert.severity === 'warning' && "bg-warning",
                  alert.severity === 'info' && "bg-primary"
                )} />
                
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className={cn("p-2 rounded-lg", styles.iconBg)}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={styles.iconColor}>
                        {getIcon(alert.severity)}
                      </div>
                    </motion.div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className={cn("font-semibold text-sm", styles.titleColor)}>
                        {alert.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.message}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss(alert.id)}
                      className="h-8 w-8 p-0 hover:bg-muted/50 rounded-full"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
      
      {unreadAlerts.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-muted/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-2 font-medium">
                <Bell className="w-3.5 h-3.5" />
                +{unreadAlerts.length - 3} alertas pendentes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
