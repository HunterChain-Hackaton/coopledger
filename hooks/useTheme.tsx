'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dry' | 'rain';

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dry', toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dry');

  useEffect(() => {
    const saved = localStorage.getItem('cl-theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  function toggle() {
    setTheme((t) => {
      const next = t === 'dry' ? 'rain' : 'dry';
      localStorage.setItem('cl-theme', next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme} className={theme === 'dry' ? 'theme-dry' : 'theme-rain'}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
