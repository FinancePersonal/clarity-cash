import { toast } from 'sonner';

export function useNotification() {
  const success = (message: string, description?: string) => {
    toast.success(message, {
      description,
      className: 'fintech-card border-success/20 bg-success/5',
    });
  };

  const error = (message: string, description?: string) => {
    toast.error(message, {
      description,
      className: 'fintech-card border-danger/20 bg-danger/5',
    });
  };

  const warning = (message: string, description?: string) => {
    toast.warning(message, {
      description,
      className: 'fintech-card border-warning/20 bg-warning/5',
    });
  };

  const info = (message: string, description?: string) => {
    toast.info(message, {
      description,
      className: 'fintech-card border-primary/20 bg-primary/5',
    });
  };

  const promise = <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      className: 'fintech-card',
    });
  };

  return { success, error, warning, info, promise };
}
