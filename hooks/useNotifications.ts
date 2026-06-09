// src/hooks/useNotifications.ts
'use client';

import { useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };
    
    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback((message: string) => {
    return addNotification(message, 'success');
  }, [addNotification]);

  const error = useCallback((message: string) => {
    return addNotification(message, 'error', 8000);
  }, [addNotification]);

  const warning = useCallback((message: string) => {
    return addNotification(message, 'warning', 6000);
  }, [addNotification]);

  const info = useCallback((message: string) => {
    return addNotification(message, 'info', 4000);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  };
}