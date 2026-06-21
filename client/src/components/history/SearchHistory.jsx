import React from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function SearchHistory({ items, onDelete, onSearch }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`/history/${id}`);
      onDelete(id);
      toast.success('Deleted', { style: { background: '#0D9488', color: '#fff' } });
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', marginBottom: 6 }}>
          No searches yet
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Try comparing a medicine!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item) => {
        const sources  = item.resultSnapshot?.sources || [];
        const best     = [...sources].sort((a, b) => a.price - b.price)[0];
        const date     = new Date(item.savedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        return (
          <div
            key={item._id}
            style={{
              background: 'var(--surface)',
              border: '1.5px solid var(--border-subtle)',
              borderLeft: '4px solid var(--teal)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
            }}
            onClick={() => onSearch(item.query)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                {item.medicineName || item.query}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {date} {best ? `· Best: ₹${best.price} at ${best.name}` : ''}
              </div>
            </div>
            <button
              aria-label={`Delete history entry for ${item.query}`}
              onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.target.style.color = 'var(--red)')}
              onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
            >
              🗑️
            </button>
          </div>
        );
      })}
    </div>
  );
}
