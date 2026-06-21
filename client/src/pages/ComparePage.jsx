import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMedicineSearch } from '../hooks/useMedicineSearch';
import SearchBar from '../components/compare/SearchBar';
import PriceCard from '../components/compare/PriceCard';
import SavingBanner from '../components/compare/SavingBanner';
import TipsBox from '../components/compare/TipsBox';
import Spinner from '../components/ui/Spinner';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ComparePage() {
  const { data, loading, error, search } = useMedicineSearch();
  const [alternatives, setAlternatives]  = useState(null);
  const [altLoading, setAltLoading]      = useState(false);
  const [showAlt, setShowAlt]            = useState(false);
  const [symptom, setSymptom]            = useState('');
  const [suggestions, setSuggestions]   = useState(null);
  const [symptomLoading, setSymptomLoading] = useState(false);
  const [searchParams]                   = useSearchParams();

  // Auto-search from URL param (from scanner/history navigation)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) search(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showAllSources, setShowAllSources] = useState(false);

  const handleSearch = (q) => {
    setAlternatives(null);
    setShowAlt(false);
    setSuggestions(null);
    setShowAllSources(false);
    search(q);
  };

  const loadAlternatives = async () => {
    if (!data?.name) return;
    setAltLoading(true);
    try {
      const res = await api.get(`/medicine/alternatives?name=${encodeURIComponent(data.name)}`);
      setAlternatives(res.data.data);
      setShowAlt(true);
    } catch {
      toast.error('Could not load alternatives');
    } finally {
      setAltLoading(false);
    }
  };

  const checkSymptom = async () => {
    if (!symptom.trim()) return;
    setSymptomLoading(true);
    setSuggestions(null);
    try {
      const res = await api.post('/ai/symptom-check', { symptom });
      setSuggestions(res.data.data);
    } catch {
      toast.error('Symptom check failed');
    } finally {
      setSymptomLoading(false);
    }
  };

  const sources = data?.sources || [];
  const sorted  = [...sources].sort((a, b) => a.price - b.price);
  const best    = sorted[0];
  const local   = sources.find((s) => s.type === 'local');
  const saving  = best && local ? Math.max(0, local.price - best.price) : 0;
  const savePct = local && local.price > 0 ? Math.round((saving / local.price) * 100) : 0;

  const inputBase = {
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--surface)',
    color: 'var(--text)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Symptom Checker */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px', boxShadow: 'var(--shadow-sm)', border: '1.5px solid var(--border)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            💬 Symptom → Medicine Suggester
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="symptom-input" type="text" value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkSymptom()}
              placeholder="e.g. headache and fever…"
              aria-label="Describe your symptom"
              style={{ ...inputBase, flex: 1, padding: '9px 12px', fontSize: 13 }}
            />
            <button id="symptom-check-btn" onClick={checkSymptom} disabled={symptomLoading || !symptom.trim()}
              aria-label="Check symptom"
              style={{ background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '9px 14px', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer', opacity: symptomLoading || !symptom.trim() ? 0.6 : 1 }}>
              {symptomLoading ? '…' : 'Check'}
            </button>
          </div>
          <AnimatePresence>
            {suggestions && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 10 }}>
                <div style={{ fontSize: 10, color: '#EF4444', background: 'var(--red-light)', padding: '4px 8px', borderRadius: 6, marginBottom: 8, fontWeight: 600, border: '1px solid rgba(239,68,68,0.3)' }}>
                  ⚠️ NOT a diagnosis. Always consult a doctor.
                </div>
                {suggestions.map((s, i) => (
                  <div key={i} style={{ padding: '8px 10px', background: 'var(--surface)', borderRadius: 'var(--radius-sm)', marginBottom: 6, borderLeft: '3px solid var(--teal)', cursor: 'pointer' }}
                    onClick={() => handleSearch(s.name)} role="button" tabIndex={0} aria-label={`Search prices for ${s.name}`}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.use}</div>
                    <div style={{ fontSize: 10, color: 'var(--teal-muted)', marginTop: 2 }}>Tap to compare prices →</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 16px' }}>
          <Spinner size={52} />
          <p style={{ color: 'var(--teal-muted)', fontSize: 14, marginTop: 14 }}>Fetching price data across pharmacies…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ margin: 16, padding: 16, background: 'var(--red-light)', borderRadius: 'var(--radius-md)', color: '#EF4444', fontSize: 13, border: '1px solid rgba(239,68,68,0.3)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div style={{ padding: '16px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{data.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>{data.genericName} · {data.category} · Per {data.stripQty}</div>
          
          <SavingBanner saving={saving} savePct={savePct} />
          
          {data.aiPriceAnalysis && (
            <div style={{ background: 'var(--teal-light)', borderLeft: '4px solid var(--teal)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '12px 14px', fontSize: 13, color: 'var(--teal-muted)', marginBottom: 16, lineHeight: 1.5, border: '1.5px solid var(--border)', borderLeftWidth: 4 }}>
              ✨ <strong>AI Savings Analysis:</strong> {data.aiPriceAnalysis}
            </div>
          )}

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Price Comparison</div>
          
          <motion.div variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
            {(showAllSources ? sorted : sorted.slice(0, 5)).map((src, i) => (
              <PriceCard key={src.name} source={src} isBest={src.name === best?.name} localPrice={local?.price} index={i} medicineName={data.name} />
            ))}
          </motion.div>

          {sorted.length > 5 && (
            <button
              id="toggle-sources-btn"
              onClick={() => setShowAllSources(!showAllSources)}
              style={{
                width: '100%',
                background: 'var(--surface)',
                color: 'var(--teal-muted)',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '10px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                marginBottom: 16,
                transition: 'all 0.2s'
              }}
            >
              {showAllSources ? '▲ Show Top 5 Cheapest Only' : `▼ View Other Platform Prices (${sorted.length - 5} More)`}
            </button>
          )}

          {data.consumerNote && (
            <div style={{ background: 'rgba(59,130,246,0.08)', borderLeft: '4px solid #3B82F6', borderRadius: '0 10px 10px 0', padding: '12px 14px', fontSize: 13, color: '#93C5FD', marginBottom: 16, lineHeight: 1.5, border: '1px solid rgba(59,130,246,0.2)', borderLeftWidth: 4 }}>
              ℹ️ <strong>Know your rights:</strong> {data.consumerNote}
            </div>
          )}
          
          <TipsBox tips={data.awarenessTips} />
          
          <button id="show-alternatives-btn" onClick={loadAlternatives} disabled={altLoading} aria-label="Show generic alternatives"
            style={{ width: '100%', background: 'var(--purple-light)', color: '#A78BFA', border: '1.5px solid rgba(124,58,237,0.4)', borderRadius: 'var(--radius-md)', padding: '12px', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 12 }}>
            {altLoading ? '⏳ Loading…' : '🔬 Show Generic Alternatives'}
          </button>
          
          <AnimatePresence>
            {showAlt && alternatives && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                {alternatives.map((alt, i) => (
                  <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--radius-md)', padding: '12px 14px', boxShadow: 'var(--shadow-sm)', marginBottom: 8, borderLeft: '3px solid var(--purple)', border: '1px solid var(--border)', borderLeftWidth: 3 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>{alt.genericName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{alt.activeIngredient} · {alt.availability}</div>
                    <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal-muted)', fontSize: 14 }}>₹{alt.estimatedPrice}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--green-light)', color: '#22C55E', padding: '2px 8px', borderRadius: 8, border: '1px solid rgba(34,197,94,0.3)' }}>{alt.savingsVsBranded}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Disclaimer */}
          <div style={{ marginTop: 24, padding: 12, background: 'rgba(239,68,68,0.06)', border: '1.5px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', fontSize: 11, color: '#FCA5A5', lineHeight: 1.5 }}>
            ⚠️ <strong>AI Disclaimer:</strong> MedSave utilizes artificial intelligence to estimate and aggregate medicine pricing across platforms. Prices, packaging, and availability vary frequently. Always verify details directly with a certified pharmacist or the official retailer before purchasing. Do not self-medicate or alter your prescription without consulting a doctor.
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Search any medicine</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Compare prices across Jan Aushadhi, Apollo,<br />MedPlus, PharmEasy and your local pharmacy.
          </p>
        </div>
      )}
    </div>
  );
}
