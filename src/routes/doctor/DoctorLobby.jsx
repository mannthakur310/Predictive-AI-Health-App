import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSocket, registerDoctor, acceptChat } from '@/lib/socket';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['General', 'Heart', 'Joint', 'Dermatology', 'Neurology'];

export default function DoctorLobby() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [pendingByCategory, setPendingByCategory] = useState({});
  const navigate = useNavigate();
  const registeredRef = useRef(false);

  useEffect(() => {
    const s = getSocket();
    const onList = ({ category, list }) => {
      setPendingByCategory((prev) => ({ ...prev, [category]: list || [] }));
    };
    const onNew = (entry) => {
      setPendingByCategory((prev) => {
        const cat = entry.category;
        const existing = prev[cat] || [];
        if (existing.some((e) => e.chatId === entry.chatId)) return prev; // de-dupe
        return { ...prev, [cat]: [...existing, entry] };
      });
      // If the new entry belongs to a non-active category, visually nudge
      // We already render badge counts; no extra UI needed here.
    };
    // set listeners first
    s.on('doctor:pending_list', onList);
    s.on('doctor:new_request', onNew);

    // Register once, then subscribe to the current category to trigger initial list
    if (!registeredRef.current) {
      registerDoctor(activeCategory);
      registeredRef.current = true;
    } else {
      s.emit('doctor:subscribe_category', { category: activeCategory });
    }
    // Also subscribe to all categories to get instant new_request notifications
    // to keep badges fresh without switching
    CATEGORIES.forEach((c) => {
      if (c !== activeCategory) s.emit('doctor:subscribe_category', { category: c });
    });
    return () => {
      s.off('doctor:pending_list', onList);
      s.off('doctor:new_request', onNew);
      // Keep subscriptions to all categories so notifications are instant
      // Optionally, we could unsubscribe here, but keeping them improves responsiveness
    };
  }, [activeCategory]);

  const handleAccept = async (chatId) => {
    const resp = await acceptChat(activeCategory, chatId, 'doctor');
    if (resp && resp.ok === false) {
      alert(resp.error || 'Failed to accept chat');
      return;
    }
    navigate(`/doctor/chat/${encodeURIComponent(activeCategory)}/${chatId}`);
  };

  const cards = useMemo(() => CATEGORIES.map((c) => ({
    name: c,
    requests: pendingByCategory[c]?.length || 0,
    requestsList: pendingByCategory[c] || []
  })), [pendingByCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Doctor Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.name} className={`border rounded-xl p-4 cursor-pointer ${activeCategory === card.name ? 'border-primary' : ''}`} onClick={() => setActiveCategory(card.name)}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">{card.name}</div>
              {card.requests > 0 && (
                <span className="text-xs bg-red-600 text-white rounded-full px-2 py-1">{card.requests} new</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground mt-2">Click to view requests</div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Incoming Requests - {activeCategory}</h2>
      <div className="space-y-3">
        {(pendingByCategory[activeCategory]?.length || 0) === 0 && <div className="text-muted-foreground">No requests yet</div>}
        {pendingByCategory[activeCategory]?.map((p) => (
          <div key={p.chatId} className="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.profileHint?.name || 'User'}</div>
              <div className="text-sm text-muted-foreground">{p.profileHint?.email || p.userId}</div>
            </div>
            <Button onClick={() => handleAccept(p.chatId)}>Accept</Button>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

