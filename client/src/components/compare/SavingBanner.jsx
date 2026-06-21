import React from 'react';
import { motion } from 'framer-motion';

export default function SavingBanner({ saving, savePct }) {
  if (!saving || saving <= 0) return null;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        background: 'linear-gradient(135deg, #22C55E, #16A34A)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        marginBottom: 16,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 26 }}>💰</span>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.8px', textTransform: 'uppercase', opacity: 0.85, fontFamily: 'var(--font-display)' }}>
          Max possible saving
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
          ₹{saving} ({savePct}% cheaper)
        </div>
      </div>
    </motion.div>
  );
}
