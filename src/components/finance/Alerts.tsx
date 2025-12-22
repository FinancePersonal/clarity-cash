import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert } from '@/types/finance';

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
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {unreadAlerts.slice(0, 3).map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={`${getBgColor(alert.severity)} border rounded-lg shadow-lg`}
          >
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getIcon(alert.severity)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(alert.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {unreadAlerts.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Card className="bg-muted">
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Bell className="w-3 h-3" />
                +{unreadAlerts.length - 3} alertas
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}