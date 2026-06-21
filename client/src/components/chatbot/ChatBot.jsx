import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import Spinner from '../ui/Spinner';

export default function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! 👋 I\'m the MedSave Assistant. Ask me anything about medicines, Jan Aushadhi, generic alternatives, or pricing in India!' },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build Anthropic-compatible message history (exclude first assistant greeting for API)
      const apiMessages = newMessages
        .filter((m, i) => !(i === 0 && m.role === 'assistant'))
        .map((m) => ({ role: m.role, content: m.content }));

      const res  = await api.post('/ai/chat', { messages: apiMessages });
      const reply = res.data.data.reply;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Sorry, I couldn\'t respond. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="chatbot-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open MedSave chatbot"
        style={{
          position: 'fixed',
          bottom: 88,
          right: 16,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--teal-gradient)',
          color: '#fff',
          border: 'none',
          fontSize: 22,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {open ? '✕' : '💊'}
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: 152,
              right: 12,
              width: 320,
              maxWidth: 'calc(100vw - 24px)',
              background: 'var(--surface-solid)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 199,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              maxHeight: '60vh',
              border: '1.5px solid var(--border)',
            }}
          >
            {/* Header */}
            <div style={{ background: 'var(--teal-gradient)', padding: '12px 16px', color: '#fff' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>🤖 MedSave Assistant</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Ask about medicines, Jan Aushadhi & prices</div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 8,
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: msg.role === 'user'
                        ? '12px 12px 2px 12px'
                        : '12px 12px 12px 2px',
                      background: msg.role === 'user' ? 'var(--teal)' : 'var(--bg)',
                      color: msg.role === 'user' ? '#fff' : 'var(--text)',
                      fontSize: 13,
                      lineHeight: 1.5,
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
                  <div style={{ background: 'var(--bg)', borderRadius: '12px 12px 12px 2px', padding: '8px 14px' }}>
                    <Spinner size={16} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6 }}>
              <input
                id="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about medicines…"
                aria-label="Chat message input"
                style={{
                  flex: 1,
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)',
                  background: 'var(--bg)',
                }}
              />
              <button
                id="chatbot-send-btn"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send chat message"
                style={{
                  background: 'var(--teal)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  fontSize: 14,
                  cursor: 'pointer',
                  opacity: loading || !input.trim() ? 0.6 : 1,
                }}
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
