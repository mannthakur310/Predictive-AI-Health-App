import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['General', 'Heart', 'Joint', 'Dermatology', 'Neurology'];

export default function UserCategories() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Choose Specialist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((c) => (
          <div key={c} className="p-4 rounded-xl border">
            <div className="font-semibold mb-2">{c}</div>
            <Button onClick={() => navigate(`/chat/start/${encodeURIComponent(c)}`)} className="w-full">Chat</Button>
          </div>
        ))}
      </div>
    </div>
  );
}


