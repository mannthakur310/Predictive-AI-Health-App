import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function DoctorAuth({ from, onAuthSuccess }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (password !== '123456') {
      setError('Invalid password');
      return;
    }

    // Store authentication
    localStorage.setItem('doctorAuthenticated', 'true');
    localStorage.setItem('doctorName', name.trim());

    // Trigger custom event to notify other components
    window.dispatchEvent(new CustomEvent('doctorAuthChanged'));

    // Notify parent component if callback exists
    if (onAuthSuccess) {
      onAuthSuccess();
    }

    // Redirect to the intended route or /doctor
    const redirectTo = from || '/doctor';
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, 50);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-modern p-8 border-2 border-border">
        <h1 className="text-2xl font-bold mb-2 text-center">Doctor Login</h1>
        <p className="text-muted-foreground text-center mb-6">Please enter your credentials to access the doctor panel</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password: <span className="text-primary font-semibold">123456</span>
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password: 123456"
              className="w-full"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}

