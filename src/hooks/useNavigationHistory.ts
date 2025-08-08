import { useState, useCallback } from 'react';

interface NavigationEntry {
  page: string;
  params: Record<string, string>;
  timestamp: number;
}

export const useNavigationHistory = () => {
  const [history, setHistory] = useState<NavigationEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((page: string, params: Record<string, string> = {}) => {
    const newEntry: NavigationEntry = {
      page,
      params,
      timestamp: Date.now()
    };

    setHistory(prev => {
      // Supprimer les entrées après l'index actuel si on navigue depuis le milieu
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newEntry];
    });
    
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getCurrentEntry = useCallback(() => {
    return currentIndex >= 0 ? history[currentIndex] : null;
  }, [currentIndex, history]);

  return {
    history,
    currentIndex,
    addToHistory,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    clearHistory,
    getCurrentEntry
  };
};
