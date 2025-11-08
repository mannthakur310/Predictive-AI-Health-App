import React, { useEffect, useRef, useState } from 'react';
import './DoctorChat.css';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getSocket, registerDoctor, sendMessage, sendFile, endChat } from '@/lib/socket';

export default function DoctorChat() {
  const { category, chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const fileInputRef = useRef(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [patientName, setPatientName] = useState('Patient');
  const [patientProfile, setPatientProfile] = useState(null);

  useEffect(() => {
    const s = getSocket();
    registerDoctor(category);
    const onMessage = (payload) => payload.chatId === chatId && setMessages((m) => [...m, payload]);
    const onFile = (payload) => payload.chatId === chatId && setMessages((m) => [...m, { ...payload, isFile: true }]);
    const onEnded = ({ chatId: id }) => id === chatId && setMessages((m) => [...m, { chatId, from: 'system', text: 'Chat ended' }]);
    const onPartnerLeft = ({ chatId: id, message }) => id === chatId && setMessages((m) => [...m, { from: 'system', text: message }]);
    const onProfile = ({ chatId: id, profile }) => {
      if (id !== chatId) return;
      const name = profile?.basic?.name || 'Patient';
      setPatientName(name);
      setPatientProfile(profile);
      setProfileLoading(false);
    };
    s.on('chat:message', onMessage);
    s.on('chat:file', onFile);
    s.on('chat:ended', onEnded);
    s.on('system:partner_left', onPartnerLeft);
    s.on('chat:profile', onProfile);
    return () => {
      s.off('chat:message', onMessage);
      s.off('chat:file', onFile);
      s.off('chat:ended', onEnded);
      s.off('system:partner_left', onPartnerLeft);
      s.off('chat:profile', onProfile);
    };
  }, [category, chatId]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, 'doctor', text);
    setText('');
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      sendFile(chatId, 'doctor', { name: file.name, type: file.type, size: file.size, data: base64 });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Chat with {patientName}</h1>
          <Button variant="outline" onClick={() => {
          const overlay = document.createElement('div');
          overlay.className = 'fixed inset-0 flex items-center justify-center bg-black/50 z-50';
          const modal = document.createElement('div');
          modal.className = 'bg-white dark:bg-gray-900 rounded-xl p-6 w-80';
          modal.innerHTML = `
            <div class="text-lg font-semibold mb-4">End chat?</div>
            <div class="flex gap-3 justify-end">
              <button id="cancelBtn" class="px-4 py-2 border rounded-md">Cancel</button>
              <button id="confirmBtn" class="px-4 py-2 bg-red-600 text-white rounded-md">End</button>
            </div>
          `;
          overlay.appendChild(modal);
          document.body.appendChild(overlay);
          modal.querySelector('#cancelBtn').onclick = () => document.body.removeChild(overlay);
          modal.querySelector('#confirmBtn').onclick = () => {
            document.body.removeChild(overlay);
            endChat(chatId, 'doctor');
            window.location.href = '/';
          };
          }}>End Chat</Button>
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <aside className="order-1 lg:order-1 border rounded-xl p-4 h-auto lg:h-[60vh] overflow-y-auto bg-white/70 dark:bg-gray-800/70">
          {profileLoading && <div className="text-xs text-muted-foreground mb-2">Loading patient profile…</div>}
          {patientProfile && (
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-2">Profile</div>
                <div className="text-sm">Name: {patientProfile.basic?.name || 'N/A'}</div>
                <div className="text-sm">Email: {patientProfile.basic?.email || 'N/A'}</div>
                <div className="text-sm">Age: {patientProfile.basic?.age || 'N/A'}</div>
                <div className="text-sm">Gender: {patientProfile.basic?.gender || 'N/A'}</div>
                <div className="text-sm">Medical Conditions: {patientProfile.extra?.medicalConditions || 'None'}</div>
                <div className="text-sm">Chronic Illnesses: {patientProfile.extra?.chronicIllnesses || 'None'}</div>
                <div className="text-sm">Allergies: {patientProfile.extra?.allegies || patientProfile.extra?.allergies || 'None'}</div>
                <div className="text-sm">Family History: {patientProfile.extra?.familyHistory || 'None'}</div>
                <div className="text-sm">Medications: {patientProfile.extra?.medications || 'None'}</div>
                <div className="text-sm">Activity Level: {patientProfile.extra?.activityLevel || 'N/A'}</div>
                <div className="text-sm">Dietary Preferences: {patientProfile.extra?.dietaryPreferences || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm font-semibold mb-2">Recent Reports</div>
                {Array.isArray(patientProfile.history) && patientProfile.history.length > 0 ? (
                  <div className="space-y-2">
                    {patientProfile.history.map((h) => {
                      let displayDate = 'Unknown date';
                      const ts = h.createdAt;
                      if (ts && typeof ts.toDate === 'function') {
                        displayDate = ts.toDate().toLocaleString();
                      } else if (ts && typeof ts.seconds === 'number') {
                        displayDate = new Date(ts.seconds * 1000).toLocaleString();
                      } else if (typeof ts === 'string') {
                        displayDate = ts;
                      }
                      return (
                        <div key={h.id} className="p-2 border rounded-md">
                          <div className="text-xs text-muted-foreground">{displayDate}</div>
                          <div className="text-sm">{h.summary}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No recent reports</div>
                )}
              </div>
            </div>
          )}
        </aside>
        <div className="order-2 lg:order-2 lg:col-span-2 border rounded-xl p-4 h-[60vh] overflow-y-auto mb-4 bg-white/70 dark:bg-gray-800/70">
          {messages.map((m, idx) => {
            const isSystem = m.from === 'system';
            const isMine = m.from === 'doctor';
            return (
              <div key={idx} className={`mb-2 flex ${isSystem ? 'justify-center' : isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`chat-message ${isSystem ? 'text-xs text-muted-foreground bg-transparent' : isMine ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-foreground'} max-w-[70%] px-3 py-2 rounded-2xl ${isSystem ? '' : isMine ? 'rounded-br-sm' : 'rounded-bl-sm'}`}> 
                  {m.isFile ? (
                    <a
                      href={`data:${m.file?.type};base64,${m.file?.data}`}
                      download={m.file?.name}
                      className={`${isSystem ? 'underline' : 'underline'}`}
                    >
                      {m.file?.name} ({Math.round((m.file?.size || 0)/1024)} KB)
                    </a>
                  ) : (
                    <span>{isSystem ? m.text : m.text}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Controls - large screens (single row) */}
      <div className="hidden md:flex gap-2 items-stretch">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="chat-input flex-1 border rounded-md px-3 py-2"
          rows={1}
        />
        <input type="file" accept="application/pdf" onChange={handleFile} ref={fileInputRef} className="hidden" id="docPdfInput" />
        <Button variant="outline" className="shrink-0" aria-label="Upload PDF" onClick={() => document.getElementById('docPdfInput').click()}>Upload PDF</Button>
        <Button onClick={handleSend}>Send</Button>
      </div>
      {/* Controls - small screens (two rows) */}
      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex gap-2 items-stretch">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            className="chat-input flex-1 border rounded-md px-3 py-2"
            rows={1}
          />
          <input type="file" accept="application/pdf" onChange={handleFile} ref={fileInputRef} className="hidden" id="docPdfInput_sm" />
          <Button variant="outline" className="shrink-0" aria-label="Upload PDF" onClick={() => document.getElementById('docPdfInput_sm').click()}>📎</Button>
        </div>
        <div className="flex">
          <Button className="w-full" onClick={handleSend}>Send</Button>
        </div>
      </div>
      </div>
    </div>
  );
}

