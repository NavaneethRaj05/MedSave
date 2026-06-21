import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAdvisor } from '../hooks/useAIAdvisor';
import { useStreamingAI } from '../hooks/useStreamingAI';
import SummaryBox from '../components/advisor/SummaryBox';
import FeatureCard from '../components/advisor/FeatureCard';
import Spinner from '../components/ui/Spinner';

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6, height: 6,
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            display: 'inline-block',
            animation: `blink 1.2s infinite ${i * 0.2}s`,
          }}
        />
      ))}
      <style>{`@keyframes blink { 0%,80%,100%{opacity:.2} 40%{opacity:1} }`}</style>
    </span>
  );
}

export default function AdvisorPage() {
  const { data, loading, error, analyse } = useAIAdvisor();
  const { text: streamText, isStreaming, startStream } = useStreamingAI();
  const [medicine, setMedicine] = useState('');

  return (
    <div style={{ padding: 16 }}>
      {/* Header Card */}
      <div
        style={{
          background: 'var(--purple-gradient)',
          borderRadius: 'var(--radius-xl)',
          padding: '18px 18px 16px',
          marginBottom: 16,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: 10, fontSize: 48, opacity: 0.18 }}>🤖</span>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', background: 'rgba(255,255,255,.2)', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
          ✨ Powered by Claude AI
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
          MedSave Product Advisor
        </h1>
        <p style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>
          AI analyses your app idea and gives you a roadmap of the most impactful features to build
        </p>
      </div>

      {/* Analyse Button */}
      <button
        id="advisor-analyse-btn"
        onClick={analyse}
        disabled={loading}
        aria-label="Analyse app idea and get feature roadmap"
        style={{
          width: '100%',
          background: 'var(--purple-gradient)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-lg)',
          padding: 15,
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: loading ? 0.75 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {loading ? (
          <>Analysing your idea <LoadingDots /></>
        ) : data ? (
          '🔄 Re-analyse'
        ) : (
          '🚀 Analyse My App Idea & Get Feature Roadmap'
        )}
      </button>

      {error && (
        <div style={{ padding: 14, background: 'var(--red-light)', borderRadius: 'var(--radius-md)', color: '#B91C1C', fontSize: 13, marginBottom: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <SummaryBox summary={data.summary} impact={data.impact} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
              🏗️ Top Features To Build
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.features || []).map((f, i) => (
                <FeatureCard key={f.rank} feature={f} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Trend Explainer (SSE Streaming) */}
      <div style={{ marginTop: 20, background: 'var(--surface)', border: '1.5px solid var(--purple-light)', borderRadius: 'var(--radius-lg)', padding: 16, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: '#A78BFA', marginBottom: 10 }}>
          📊 Price Trend Explainer (Live Stream)
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <input
            id="trend-medicine-input"
            type="text"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            placeholder="Medicine name e.g. Metformin"
            aria-label="Enter medicine for price trend explanation"
            style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
          />
          <button
            id="trend-stream-btn"
            onClick={() => startStream(medicine)}
            disabled={isStreaming || !medicine.trim()}
            aria-label="Start price trend stream"
            style={{
              background: 'var(--purple-gradient)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '9px 14px',
              fontSize: 13,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              cursor: 'pointer',
              opacity: isStreaming || !medicine.trim() ? 0.6 : 1,
            }}
          >
            {isStreaming ? '⏳' : '▶ Stream'}
          </button>
        </div>
        {(streamText || isStreaming) && (
          <div
            style={{
              background: 'var(--purple-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: 13,
              lineHeight: 1.7,
              color: '#E9D5FF',
              minHeight: 60,
              whiteSpace: 'pre-wrap',
              border: isStreaming ? '1.5px solid var(--purple)' : '1.5px solid transparent',
              transition: 'border-color 0.3s',
            }}
          >
            {streamText}
            {isStreaming && <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--purple)', marginLeft: 2, animation: 'blink 1s infinite' }} />}
          </div>
        )}
      </div>
    </div>
  );
}
