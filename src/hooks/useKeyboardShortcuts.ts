import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          shortcut.callback();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const SHORTCUTS = {
  NEW_EXPENSE: { key: 'n', ctrl: true, description: 'Nova despesa' },
  NEW_INCOME: { key: 'i', ctrl: true, description: 'Nova receita' },
  SEARCH: { key: 'k', ctrl: true, description: 'Buscar' },
  TOGGLE_THEME: { key: 't', ctrl: true, description: 'Alternar tema' },
  DASHBOARD: { key: 'd', ctrl: true, description: 'Ir para Dashboard' },
  REPORTS: { key: 'r', ctrl: true, description: 'Ir para Relatórios' },
};
