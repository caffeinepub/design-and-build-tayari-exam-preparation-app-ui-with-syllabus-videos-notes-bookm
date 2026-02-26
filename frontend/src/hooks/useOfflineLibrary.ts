import { useState, useEffect } from 'react';

interface OfflineItem {
  id: string;
  title: string;
  url: string;
  type: 'document' | 'video' | 'note';
}

const STORAGE_KEY = 'tayari_offline_library';

export function useOfflineLibrary() {
  const [items, setItems] = useState<OfflineItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const addItem = (item: OfflineItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (!exists) {
      const newItems = [...items, item];
      setItems(newItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    }
  };

  const removeItem = (id: string) => {
    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  return { items, addItem, removeItem };
}
