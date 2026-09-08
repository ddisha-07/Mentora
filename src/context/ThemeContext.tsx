'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'bright';

interface ThemeContextType {
  theme: Theme;
  isBright: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read persisted theme from localStorage or default to dark
    try {
      const savedTheme = localStorage.getItem('mentora_theme') as Theme | null;
      if (savedTheme === 'bright' || savedTheme === 'dark') {
        setThemeState(savedTheme);
        applyTheme(savedTheme);
      } else {
        applyTheme('dark');
      }
    } catch {
      applyTheme('dark');
    }
    setMounted(true);
  }, []);

  const applyTheme = (targetTheme: Theme) => {
    const root = document.documentElement;
    if (targetTheme === 'bright') {
      root.classList.add('bright');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'bright');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('bright');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem('mentora_theme', newTheme);
    } catch {}
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'bright' ? 'dark' : 'bright';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isBright: mounted && theme === 'bright',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return fallback if used outside provider
    return {
      theme: 'dark' as Theme,
      isBright: false,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  return context;
}
