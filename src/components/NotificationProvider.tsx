import React, { createContext, useCallback, useContext, useState } from 'react';
import Notification from './Notification';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextValue {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification doit être utilisé dans un NotificationProvider');
  }
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<Array<{ id: number; type: NotificationType; message: string; duration?: number }>>([]);
  const [counter, setCounter] = useState(0);

  const showNotification = useCallback((type: NotificationType, message: string, duration = 4000) => {
    setCounter((c) => c + 1);
    const id = counter + 1;
    setQueue((q) => [...q, { id, type, message, duration }]);
  }, [counter]);

  const handleClose = (id: number) => {
    setQueue((q) => q.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {queue.map((n) => (
          <Notification key={n.id} type={n.type} message={n.message} duration={n.duration} onClose={() => handleClose(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;


