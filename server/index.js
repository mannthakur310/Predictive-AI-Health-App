import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5157'], credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5157'],
    methods: ['GET', 'POST']
  }
});

// Ephemeral in-memory structures
const CATEGORY_LIST = ['General', 'Heart', 'Joint', 'Dermatology', 'Neurology'];
const categoryToDoctors = new Map(); // category -> Set(socketId)
const categoryToPending = new Map(); // category -> Array<{ chatId, userId, profileHint, category }>
const chatIdToSockets = new Map(); // chatId -> { userSocketId?: string, doctorSocketId?: string, category }
const chatIdToProfile = new Map(); // chatId -> last sent profile payload

function ensureCategory(category) {
  if (!categoryToDoctors.has(category)) categoryToDoctors.set(category, new Set());
  if (!categoryToPending.has(category)) categoryToPending.set(category, []);
}

function generateChatId() {
  return 'chat_' + Math.random().toString(36).slice(2, 10);
}

io.on('connection', (socket) => {
  // Identify role upon connection
  socket.on('register', ({ role, category, userId, profileHint }) => {
    if (role === 'doctor') {
      ensureCategory(category);
      categoryToDoctors.get(category).add(socket.id);
      socket.join(`doctors:${category}`);
      const pending = categoryToPending.get(category);
      socket.emit('doctor:pending_list', { category, list: pending });
    }
    if (role === 'user') {
      socket.data.userId = userId;
      socket.data.profileHint = profileHint;
    }
  });

  // User requests a chat for a category
  socket.on('user:start_chat', ({ category, userId, profileHint }, ack) => {
    ensureCategory(category);
    // Reuse existing pending chat for same user+category
    const existing = categoryToPending.get(category).find((p) => p.userId === userId);
    if (existing && chatIdToSockets.has(existing.chatId)) {
      const mapping = chatIdToSockets.get(existing.chatId);
      mapping.userSocketId = socket.id;
      chatIdToSockets.set(existing.chatId, mapping);
      socket.join(`chat:${existing.chatId}`);
      ack && ack({ chatId: existing.chatId, reused: true });
      return;
    }
    const chatId = generateChatId();
    chatIdToSockets.set(chatId, { userSocketId: socket.id, category });
    const pendingEntry = { chatId, userId, profileHint, category };
    categoryToPending.get(category).push(pendingEntry);
    io.to(`doctors:${category}`).emit('doctor:new_request', pendingEntry);
    socket.join(`chat:${chatId}`);
    ack && ack({ chatId });
  });

  // Doctor accepts a chat
  socket.on('doctor:accept_chat', ({ category, chatId, doctorId }, ack) => {
    ensureCategory(category);
    const mapping = chatIdToSockets.get(chatId);
    if (!mapping) {
      ack && ack({ ok: false, error: 'Chat not found' });
      return;
    }
    mapping.doctorSocketId = socket.id;
    chatIdToSockets.set(chatId, mapping);
    socket.join(`chat:${chatId}`);
    // Remove from pending
    const list = categoryToPending.get(category).filter((p) => p.chatId !== chatId);
    categoryToPending.set(category, list);
    io.to(`doctors:${category}`).emit('doctor:pending_list', { category, list });
    // Notify user doctor joined and confirm to doctor
    io.to(`chat:${chatId}`).emit('system:doctor_joined', { chatId, doctorId });
    // If profile already provided by user, deliver it to the room now
    if (chatIdToProfile.has(chatId)) {
      io.to(`chat:${chatId}`).emit('chat:profile', { chatId, profile: chatIdToProfile.get(chatId) });
    }
    ack && ack({ ok: true, chatId });
  });

  // Messaging within chat
  socket.on('chat:message', ({ chatId, from, text, timestamp }) => {
    if (!chatIdToSockets.has(chatId)) return;
    io.to(`chat:${chatId}`).emit('chat:message', { chatId, from, text, timestamp });
  });

  // Forward rich profile info to doctor
  socket.on('chat:profile', ({ chatId, profile }) => {
    if (!chatIdToSockets.has(chatId)) return;
    chatIdToProfile.set(chatId, profile);
    io.to(`chat:${chatId}`).emit('chat:profile', { chatId, profile });
  });

  // File upload as base64 (ephemeral)
  socket.on('chat:file', ({ chatId, from, file }) => {
    // file: { name, type, size, data: base64 }
    if (!chatIdToSockets.has(chatId)) return;
    io.to(`chat:${chatId}`).emit('chat:file', { chatId, from, file });
  });

  // When doctor joins a category lobby to get notifications
  socket.on('doctor:subscribe_category', ({ category }) => {
    ensureCategory(category);
    socket.join(`doctors:${category}`);
    socket.emit('doctor:pending_list', { category, list: categoryToPending.get(category) });
  });

  socket.on('doctor:unsubscribe_category', ({ category }) => {
    ensureCategory(category);
    socket.leave(`doctors:${category}`);
  });

  // Close chat from either side (two-phase)
  socket.on('chat:end', ({ chatId, by }) => {
    const mapping = chatIdToSockets.get(chatId);
    if (!mapping) return;
    const leaver = by === 'doctor' ? 'doctor' : 'user';
    const partner = leaver === 'doctor' ? 'user' : 'doctor';
    // Notify partner that counterpart left
    io.to(`chat:${chatId}`).emit('system:partner_left', { chatId, who: leaver, message: `${leaver} left the chat. ${partner} may now end chat.` });
    // If both already left, clean up
    if (leaver === 'doctor') mapping.doctorSocketId = undefined; else mapping.userSocketId = undefined;
    const bothGone = !mapping.userSocketId && !mapping.doctorSocketId;
    if (bothGone) {
      io.to(`chat:${chatId}`).emit('chat:ended', { chatId });
      io.socketsLeave(`chat:${chatId}`);
      chatIdToSockets.delete(chatId);
      chatIdToProfile.delete(chatId);
      // Remove from pending (if any) and notify doctors lobby
      const category = mapping.category;
      if (categoryToPending.has(category)) {
        const filtered = categoryToPending.get(category).filter((p) => p.chatId !== chatId);
        categoryToPending.set(category, filtered);
        io.to(`doctors:${category}`).emit('doctor:pending_list', { category, list: filtered });
      }
    } else {
      chatIdToSockets.set(chatId, mapping);
    }
  });

  socket.on('disconnect', () => {
    // Clean doctor presence
    for (const [category, doctors] of categoryToDoctors.entries()) {
      if (doctors.has(socket.id)) {
        doctors.delete(socket.id);
      }
    }
    // If a user disconnects who was only participant, end chats where needed
    for (const [chatId, mapping] of chatIdToSockets.entries()) {
      if (mapping.userSocketId === socket.id || mapping.doctorSocketId === socket.id) {
        io.to(`chat:${chatId}`).emit('chat:ended', { chatId });
        io.socketsLeave(`chat:${chatId}`);
        chatIdToSockets.delete(chatId);
        chatIdToProfile.delete(chatId);
        // Also remove any pending request for this chat and notify doctors lobby
        const category = mapping.category;
        if (categoryToPending.has(category)) {
          const filtered = categoryToPending.get(category).filter((p) => p.chatId !== chatId);
          categoryToPending.set(category, filtered);
          io.to(`doctors:${category}`).emit('doctor:pending_list', { category, list: filtered });
        }
      }
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, categories: CATEGORY_LIST });
});

app.get('/', (_req, res) => {
  res.type('text/plain').send('Socket server is running. Use /health or connect via WebSocket.');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket server running on :${PORT}`);
});


