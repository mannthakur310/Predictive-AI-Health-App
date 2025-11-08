import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DoctorAuth from './DoctorAuth';

export default function ProtectedDoctorRoute({ children }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check authentication immediately on mount using lazy initialization
    return localStorage.getItem('doctorAuthenticated') === 'true';
  });

  useEffect(() => {
    // Check authentication status on mount and route changes
    const checkAuth = () => {
      const authStatus = localStorage.getItem('doctorAuthenticated') === 'true';
      setIsAuthenticated(authStatus);
    };

    checkAuth();

    // Listen for custom authentication event (when login happens)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('doctorAuthChanged', handleAuthChange);

    return () => {
      window.removeEventListener('doctorAuthChanged', handleAuthChange);
    };
  }, [location.pathname]); // Re-check when route changes

  if (!isAuthenticated) {
    // Pass the current location so we can redirect back after login
    return <DoctorAuth from={location.pathname} onAuthSuccess={() => {
      setIsAuthenticated(true);
    }} />;
  }

  return children;
}

