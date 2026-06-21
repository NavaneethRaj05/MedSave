import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BarcodeScanner from '../components/scanner/BarcodeScanner';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function ScannerPage() {
  const navigate               = useNavigate();
  const [tab, setTab]          = useState('barcode'); // 'barcode' | 'prescription'
  const [manualInput, setManualInput] = useState('');
  const [prescriptionMeds, setPrescriptionMeds] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDetect = useCallback((text) => {
    toast.success(`Detected: ${text}`, { style: { background: '#0D9488', color: '#fff' } });
    // Navigate to compare with pre-filled query
    navigate(`/compare?q=${encodeURIComponent(text)}`);
  }, [navigate]);

  const handleManualSearch = () => {
    if (manualInput.trim()) {
      navigate(`/compare?q=${encodeURIComponent(manualInput.trim())}`);
    }
  };

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setPrescriptionMeds(null);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(',')[1];
        const mediaType = file.type || 'image/jpeg';
        try {
          const res = await api.post('/ai/read-prescription', { image: base64, mediaType });
          setPrescriptionMeds(res.data.data);
          toast.success('Prescription read!', { style: { background: '#0D9488', color: '#fff' } });
        } catch {
          toast.error('Could not read prescription');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      toast.error('Upload failed');
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
        📷 Medicine Scanner
      </h1>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        Scan a barcode or upload a prescription photo
      </p>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['barcode', 'prescription'].map((t) => (
          <button
            key={t}
            id={`scanner-tab-${t}`}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: tab === t ? 'var(--teal)' : 'var(--teal-light)',
              color: tab === t ? '#fff' : 'var(--teal-dark)',
              transition: 'all 0.2s',
            }}
          >
            {t === 'barcode' ? '📷 Scan Barcode' : '📋 Upload Prescription'}
          </button>
        ))}
      </div>

      {tab === 'barcode' && (
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12 }}>
            Point camera at medicine barcode or strip
          </p>
          <BarcodeScanner onDetect={handleDetect} />

          {/* Manual fallback */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textAlign: 'center' }}>
              — or type manually —
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                id="manual-scanner-input"
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                placeholder="Type medicine name…"
                aria-label="Manual medicine name input"
                style={{
                  flex: 1,
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text)',
                  outline: 'none',
                }}
              />
              <button
                id="manual-scanner-search-btn"
                onClick={handleManualSearch}
                aria-label="Search manually typed medicine"
                style={{
                  background: 'var(--teal)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 16px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                Go →
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'prescription' && (
        <div>
          <div
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px 20px',
              textAlign: 'center',
              background: 'var(--surface)',
              cursor: 'pointer',
              position: 'relative',
            }}
            onClick={() => document.getElementById('prescription-upload').click()}
            role="button"
            tabIndex={0}
            aria-label="Upload prescription image"
          >
            <div style={{ fontSize: 48, marginBottom: 10 }}>📋</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>
              Upload Prescription Photo
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Claude AI will extract medicine names and dosages
            </div>
            {uploading && (
              <div style={{ marginTop: 16 }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                <p style={{ fontSize: 12, color: 'var(--teal-dark)', marginTop: 8 }}>Reading prescription…</p>
              </div>
            )}
            <input
              id="prescription-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePrescriptionUpload}
              aria-label="Prescription image file input"
            />
          </div>

          {prescriptionMeds && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>
                📋 Detected Medicines
              </div>
              {prescriptionMeds.map((med, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border-subtle)',
                    borderLeft: '3px solid var(--teal)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: 8,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/compare?q=${encodeURIComponent(med.name)}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Compare prices for ${med.name}`}
                >
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                    {med.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {med.dosage} · {med.frequency}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--teal-dark)', marginTop: 4 }}>Tap to compare prices →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
