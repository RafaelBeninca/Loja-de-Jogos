import React, { createContext, useState, useEffect } from 'react';
import { darkTheme, lightTheme } from '../components/Theming';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThemeContextInterface } from '../types/types';

const ThemeContext = createContext<ThemeContextInterface>({
  darkMode: false,
  toggleTheme: () => undefined,
});

interface ThemeProviderWrapperProps {
  children: React.ReactElement
}

const ThemeProviderWrapper = ({ children }: ThemeProviderWrapperProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }
    
    setHasCheckedLocalStorage(true)
  }, []);

  useEffect(() => {
    if (!hasCheckedLocalStorage) return

    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode, hasCheckedLocalStorage]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProviderWrapper, ThemeContext };