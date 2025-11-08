import React, { useEffect, useMemo, useRef, useState } from 'react';
import './UserChat.css';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import { getSocket, registerUser, startChat, sendMessage, sendFile, endChat, sendProfile } from '@/lib/socket';
import { doc, getDoc, collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

export default function UserChat() {
  const { category } = useParams();
  const { user } = useUser();
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const [doctorJoined, setDoctorJoined] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const waitTimerRef = useRef(null);
  const doctorJoinedRef = useRef(false);
  const chatIdRef = useRef('');
  const [secondsLeft, setSecondsLeft] = useState(60);
  const countdownRef = useRef(null);
  const graceTimerRef = useRef(null);
  const fileInputRef = useRef(null);
  const profileHint = useMemo(() => ({
    name: user?.fullName,
    email: user?.primaryEmailAddress?.emailAddress
  }), [user]);

  async function buildAndSendProfilePayload(activeChatId) {
    try {
      const userId = user?.id;
      const profileDoc = await getDoc(doc(db, 'users', userId));
      const profileData = profileDoc.exists() ? profileDoc.data() : {};
      const basic = {
        name: profileData.name || user?.fullName || 'N/A',
        email: profileData.email || user?.primaryEmailAddress?.emailAddress || 'N/A',
        age: profileData.age || 'N/A',
        gender: profileData.gender || 'N/A',
      };
      // Use diagnosisReports as in existing flow
      let history = [];
      try {
        const reportsQuery = query(
          collection(db, 'diagnosisReports'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(reportsQuery);
        history = querySnapshot.docs.slice(0, 3).map(d => ({
          id: d.id,
          createdAt: d.data().createdAt || null,
          summary: d.data()?.geminiResponse?.summaryReport || 'Summary not available.'
        }));
      } catch {}
      sendProfile(activeChatId, { basic, extra: profileData, history });
    } catch {}
  }

  const startedRef = useRef(false);
  useEffect(() => {
    const s = getSocket();
    const onConnect = () => setConnected(true);
    const onMessage = (payload) => setMessages((m) => [...m, payload]);
    const onFile = (payload) => setMessages((m) => [...m, { ...payload, isFile: true }]);
    const onJoined = async ({ chatId }) => {
      setDoctorJoined(true);
      doctorJoinedRef.current = true;
      setWaiting(false);
      if (waitTimerRef.current) { clearTimeout(waitTimerRef.current); waitTimerRef.current = null; }
      if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
      if (graceTimerRef.current) { clearTimeout(graceTimerRef.current); graceTimerRef.current = null; }
      setMessages((m) => [...m, { chatId, from: 'system', text: 'Doctor joined. You can start chatting.' }]);
      await buildAndSendProfilePayload(chatId);
    };
    const onEnded = ({ chatId }) => setMessages((m) => [...m, { chatId, from: 'system', text: 'Chat ended' }]);
    const onPartnerLeft = ({ message }) => setMessages((m) => [...m, { from: 'system', text: message }]);

    s.on('connect', onConnect);
    s.on('chat:message', onMessage);
    s.on('chat:file', onFile);
    s.on('system:doctor_joined', onJoined);
    s.on('chat:ended', onEnded);
    s.on('system:partner_left', onPartnerLeft);

    if (!startedRef.current) {
      startedRef.current = true;
      registerUser(user?.id, profileHint);
      startChat(category, user?.id, profileHint).then(async ({ chatId }) => {
        setChatId(chatId);
        chatIdRef.current = chatId;
        // Send profile early so server can cache and deliver to doctor on accept
        await buildAndSendProfilePayload(chatId);
        // start 60s waiting timer AFTER chatId is available
        setWaiting(true);
        setSecondsLeft(60);
        if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
        waitTimerRef.current = setTimeout(() => {
          if (!doctorJoinedRef.current) {
            setMessages((m) => [...m, { from: 'system', text: 'No doctor available at the moment. Chat will close automatically in 30 seconds unless you close it now.' }]);
            if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
            graceTimerRef.current = setTimeout(() => {
              if (!doctorJoinedRef.current) {
                endChat(chatIdRef.current, 'user');
                window.location.href = '/';
              }
            }, 30000);
          }
        }, 60000);
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setSecondsLeft((prev) => {
            if (doctorJoinedRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
              return prev;
            }
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
    }

    return () => {
      s.off('connect', onConnect);
      s.off('chat:message', onMessage);
      s.off('chat:file', onFile);
      s.off('system:doctor_joined', onJoined);
      s.off('chat:ended', onEnded);
      s.off('system:partner_left', onPartnerLeft);
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
    };
  }, [category, user, profileHint]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, 'user', text);
    setText('');
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      sendFile(chatId, 'user', { name: file.name, type: file.type, size: file.size, data: base64 });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Chat with {decodeURIComponent(category)} Doctor</h1>
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
            endChat(chatId, 'user');
            window.location.href = '/';
          };
        }}>End Chat</Button>
      </div>
      <div className="border rounded-xl p-4 h-[60vh] overflow-y-auto mb-4 bg-white/70 dark:bg-gray-800/70">
        {waiting && !doctorJoined && (
          <div className="mb-3 flex justify-center">
            <div className="text-xs text-muted-foreground">Waiting for a doctor to join… {String(Math.floor(secondsLeft/60)).padStart(2,'0')}:{String(secondsLeft%60).padStart(2,'0')}</div>
          </div>
        )}
        {messages.map((m, idx) => {
          const isSystem = m.from === 'system';
          const isMine = m.from === 'user';
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
      {/* Controls - large screens (single row) */}
      <div className="hidden md:flex gap-2 items-stretch">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="chat-input flex-1 border rounded-md px-3 py-2"
          rows={1}
        />
        <input type="file" accept="application/pdf" onChange={handleFile} ref={fileInputRef} className="hidden" id="pdfInput" />
        <Button variant="outline" className="shrink-0" aria-label="Upload PDF" onClick={() => document.getElementById('pdfInput').click()}>Upload PDF</Button>
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
          <input type="file" accept="application/pdf" onChange={handleFile} ref={fileInputRef} className="hidden" id="pdfInput_sm" />
          <Button variant="outline" className="shrink-0" aria-label="Upload PDF" onClick={() => document.getElementById('pdfInput_sm').click()}>📎</Button>
        </div>
        <div className="flex">
          <Button className="w-full" onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  );
}


