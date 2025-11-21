import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function DoctorHeader() {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = localStorage.getItem('doctorAuthenticated') === 'true';
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const name = localStorage.getItem('doctorName') || 'Doctor';
        setDoctorName(name);
      } else {
        setDoctorName('');
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('doctorAuthChanged', handleAuthChange);

    // Initialize dark mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    return () => {
      window.removeEventListener('doctorAuthChanged', handleAuthChange);
    };
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('doctorAuthenticated');
      localStorage.removeItem('doctorName');
      window.dispatchEvent(new CustomEvent('doctorAuthChanged'));
      navigate('/doctor', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r from-primary/15 via-secondary/8 to-primary/15 dark:supports-[backdrop-filter]:bg-gradient-to-r dark:from-primary/25 dark:via-secondary/15 dark:to-primary/25">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo - Left Side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="/Logo.png"
              alt="Predictive Logo"
              className="h-10 w-10 lg:w-15 lg:h-15"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
            <span className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Predictive
            </span>
          </div>

          {/* Right Side - Doctor Name, Dark Mode & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Only show doctor name and logout when authenticated */}
            {isAuthenticated && (
              <>
                <span className="hidden sm:inline-block text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Dr. {doctorName}</span>
                </span>
                
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 border-2 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-white/60 dark:hover:bg-gray-800/60 shadow-modern"
                >
                  Logout
                </Button>
              </>
            )}
            
            {/* Dark Mode Toggle - Always visible */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-300 group shadow-modern flex items-center justify-center border border-gray-200/50 dark:border-gray-600/50"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

