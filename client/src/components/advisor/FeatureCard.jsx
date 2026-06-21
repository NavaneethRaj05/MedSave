import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';

const priorityVariant = (p) => (p === 'High' ? 'high' : p === 'Medium' ? 'medium' : 'low');

export default function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--border-subtle)',
        borderLeft: '4px solid var(--purple)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{feature.icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
          #{feature.rank} · {feature.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
          {feature.description}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Badge variant={priorityVariant(feature.priority)}>{feature.priority} Priority</Badge>
          <Badge variant="grey">Effort: {feature.effort}</Badge>
          <Badge variant={priorityVariant(feature.impact)}>Impact: {feature.impact}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
