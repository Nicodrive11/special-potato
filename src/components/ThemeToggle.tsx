// src/components/ThemeToggle.tsx
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  variant?: 'nav' | 'button' | 'minimal';
  showLabel?: boolean;
}

export default function ThemeToggle({ variant = 'nav', showLabel = true }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use a try-catch to handle cases where provider might not be available yet
  let themeContext;
  try {
    themeContext = useTheme();
  } catch (error) {
    // Fallback for when provider is not available
    themeContext = { theme: 'light', toggleTheme: () => {} };
  }
  
  const { theme, toggleTheme } = themeContext;

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Show nothing until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className={`${variant === 'minimal' ? 'w-9 h-9' : variant === 'button' ? 'w-24 h-10' : 'w-20 h-6'}`}>
        {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleToggle}
        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        {theme === 'light' ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            {showLabel && 'Dark Mode'}
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {showLabel && 'Light Mode'}
          </>
        )}
      </button>
    );
  }

  // Default nav variant with toggle switch
  return (
    <div className="flex items-center space-x-3">
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      )}
      
      <button
        onClick={handleToggle}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${theme === 'light' ? 'bg-gray-200' : 'bg-indigo-600'}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 flex items-center justify-center
            ${theme === 'light' ? 'translate-x-1' : 'translate-x-6'}
          `}
        >
          {theme === 'light' ? (
            <svg className="w-2.5 h-2.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}