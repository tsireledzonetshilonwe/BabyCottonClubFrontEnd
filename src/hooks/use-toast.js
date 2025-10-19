import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Avoid intrusive alerts; log instead. UI can read `toasts` to display.
    if (variant === 'destructive') {
      console.error(`[Toast Error] ${title}: ${description}`);
    } else {
      console.log(`[Toast] ${title}: ${description}`);
    }
    
    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  return { toast, toasts };
};