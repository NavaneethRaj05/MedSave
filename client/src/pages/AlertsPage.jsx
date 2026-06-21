import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

export default function AlertsPage() {
  const [alerts, setAlerts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [creating, setCreating]   = useState(false);
  const [form, setForm]           = useState({ medicineName: '', targetPrice: '', email: '' });

  const load = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.data || []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.medicineName || !form.targetPrice) {
      toast.error('Medicine name and target price are required');
      return;
    }
    setCreating(true);
    try {
      const res = await api.post('/alerts', {
        medicineName: form.medicineName,
        targetPrice:  parseFloat(form.targetPrice),
        email:        form.email,
      });
      setAlerts((prev) => [res.data.data, ...prev]);
      setForm({ medicineName: '', targetPrice: '', email: '' });
      toast.success('🔔 Alert set!', { style: { background: '#0D9488', color: '#fff' } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create alert');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/alerts/${id}`);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      toast.success('Alert deleted', { style: { background: '#0D9488', color: '#fff' } });
    } catch {
      toast.error('Failed to delete alert');
    }
  };

  const inputStyle = {
    width: '100%',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    color: 'var(--text)',
    outline: 'none',
    background: 'var(--surface)',
    marginBottom: 10,
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        🔔 Price Alerts
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Get notified when a medicine drops to your target price
      </p>

      {/* Create Alert Form */}
      <form
        onSubmit={handleCreate}
        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16, boxShadow: 'var(--shadow-sm)', marginBottom: 20 }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>
          Set New Alert
        </div>
        <input
          id="alert-medicine-input"
          type="text"
          value={form.medicineName}
          onChange={(e) => setForm((f) => ({ ...f, medicineName: e.target.value }))}
          placeholder="Medicine name e.g. Metformin 500mg"
          aria-label="Medicine name for alert"
          style={inputStyle}
          required
        />
        <input
          id="alert-price-input"
          type="number"
          value={form.targetPrice}
          onChange={(e) => setForm((f) => ({ ...f, targetPrice: e.target.value }))}
          placeholder="Target price (₹)"
          aria-label="Target price in rupees"
          min="1"
          style={inputStyle}
          required
        />
        <input
          id="alert-email-input"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="Email (optional)"
          aria-label="Email for alert notification"
          style={{ ...inputStyle, marginBottom: 14 }}
        />
        <button
          id="alert-set-btn"
          type="submit"
          disabled={creating}
          aria-label="Set price alert"
          style={{
            width: '100%',
            background: 'var(--teal-gradient)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '13px',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? '⏳ Setting Alert…' : '🔔 Set Alert'}
        </button>
      </form>

      {/* Alerts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}><Spinner size={36} /></div>
      ) : alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text-muted)', fontSize: 14 }}>No alerts yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                style={{
                  background: 'var(--surface)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: `4px solid ${alert.isTriggered ? 'var(--green)' : 'var(--amber)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                    {alert.medicineName}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Target: ₹{alert.targetPrice}
                    {alert.currentBestPrice ? ` · Current best: ₹${alert.currentBestPrice} at ${alert.bestSource}` : ''}
                  </div>
                  <div style={{ marginTop: 5 }}>
                    {alert.isTriggered ? (
                      <Badge variant="triggered">✅ Price dropped!</Badge>
                    ) : (
                      <Badge variant="medium">⏳ Watching</Badge>
                    )}
                  </div>
                </div>
                <button
                  aria-label={`Delete alert for ${alert.medicineName}`}
                  onClick={() => handleDelete(alert._id)}
                  style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 'var(--radius-sm)' }}
                  onMouseEnter={(e) => (e.target.style.color = 'var(--red)')}
                  onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                >
                  🗑️
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
