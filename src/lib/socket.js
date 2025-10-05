import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
  }
  return socket;
}

export function registerUser(userId, profileHint) {
  const s = getSocket();
  s.emit('register', { role: 'user', userId, profileHint });
}

export function registerDoctor(category) {
  const s = getSocket();
  s.emit('register', { role: 'doctor', category });
  s.emit('doctor:subscribe_category', { category });
}

export function startChat(category, userId, profileHint) {
  const s = getSocket();
  return new Promise((resolve) => {
    s.emit('user:start_chat', { category, userId, profileHint }, (resp) => {
      resolve(resp);
    });
  });
}

export function acceptChat(category, chatId, doctorId) {
  const s = getSocket();
  return new Promise((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        console.warn('doctor:accept_chat ack timeout; proceeding');
        settled = true;
        resolve({ ok: true, chatId });
      }
    }, 2000);
    s.emit('doctor:accept_chat', { category, chatId, doctorId }, (resp) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(resp);
      }
    });
  });
}

export function sendMessage(chatId, from, text) {
  const s = getSocket();
  s.emit('chat:message', { chatId, from, text, timestamp: Date.now() });
}

export function sendFile(chatId, from, file) {
  const s = getSocket();
  s.emit('chat:file', { chatId, from, file });
}

export function endChat(chatId, by) {
  const s = getSocket();
  s.emit('chat:end', { chatId, by });
}

export function sendProfile(chatId, profile) {
  const s = getSocket();
  s.emit('chat:profile', { chatId, profile });
}


