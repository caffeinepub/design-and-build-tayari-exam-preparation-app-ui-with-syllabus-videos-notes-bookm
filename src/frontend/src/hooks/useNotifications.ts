import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'update' | 'exam';
  date: string;
  read: boolean;
}

const STORAGE_KEY = 'tayari_notifications';

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Video Added',
    message: 'New GK videos have been added to the course.',
    category: 'update',
    date: '2026-02-13',
    read: false,
  },
  {
    id: '2',
    title: 'Exam Schedule Released',
    message: 'Kharidar exam dates have been announced for 2083.',
    category: 'exam',
    date: '2026-02-12',
    read: false,
  },
  {
    id: '3',
    title: 'Notes Updated',
    message: 'Constitution notes have been updated with latest amendments.',
    category: 'update',
    date: '2026-02-10',
    read: false,
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch {
        setNotifications(defaultNotifications);
      }
    } else {
      setNotifications(defaultNotifications);
    }
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, markAsRead, unreadCount };
}
