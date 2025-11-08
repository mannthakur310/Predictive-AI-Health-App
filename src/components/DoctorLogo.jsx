import React from 'react';

export default function DoctorLogo() {
  return (
    <div className="flex items-center justify-center py-4 sm:py-6 mb-4 sm:mb-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <img
          src="/Logo.png"
          alt="Predictive Logo"
          className="h-12 w-12 sm:h-16 sm:w-16"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
        <span className="font-bold text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Predictive
        </span>
      </div>
    </div>
  );
}

